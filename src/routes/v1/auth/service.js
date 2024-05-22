import boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'
import jwksClient from 'jwks-rsa'

import { config } from '../../../config/config.js'
import { UsuarioService } from '../usuario/service.js'
import { TipoUsuarioService } from '../tipo_usuario/service.js'

const service = new UsuarioService()
const tipoUsuarioService = new TipoUsuarioService()

class AuthService {
  constructor(){}

  async getUsuario(correo, password) {
    const usuario = await service.findOneByCorreo(correo)

    if (!usuario){
      throw boom.unauthorized()
    }

    const passwordValida = await bcrypt.compare(password, usuario.password)

    if (!passwordValida){
      throw boom.unauthorized()
    }

    delete usuario.dataValues.password
    return usuario
  }

  async signToken(usuario){
    const tipoUsuario = await tipoUsuarioService.findOne(usuario.tipoUsuarioId)
    const accessPayload = {
      sub: usuario.id,
      rol: tipoUsuario.clave
    }
    const refreshPayload = {
      sub: usuario.id
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    const accessPem = path.join(__dirname, '../../../../certs/private_access.pem')
    const accessSecret = await fs.readFile(accessPem, 'utf-8')
    const accessToken = jwt.sign(accessPayload, accessSecret, { expiresIn: '15m', algorithm: 'RS256'})

    const refreshPem = path.join(__dirname, '../../../../certs/private_refresh.pem')
    const refreshSecret = await fs.readFile(refreshPem, 'utf-8')
    const refreshToken = jwt.sign(refreshPayload, refreshSecret, { expiresIn: '30d', algorithm: 'RS256'})

    return { accessToken, refreshToken, nombre: usuario.nombre }
  }

  async refreshToken(refreshToken) {
    try {
      const client = jwksClient({
        jwksUri: config.JWKS_REFRESH_URI,
        cache: true,
        rateLimit: true,
        timeout: 30000 // Defaults to 30s
      })

      const key = await client.getSigningKey()

      const refreshPayload = jwt.verify(refreshToken, key.getPublicKey())

      const usuario = await service.findOne(refreshPayload.sub)
      const tipoUsuario = await tipoUsuarioService.findOne(usuario.tipoUsuarioId)

      const accessPayload = {
        sub: usuario.id,
        rol: tipoUsuario.clave
      }

      const __dirname = path.dirname(fileURLToPath(import.meta.url))

      const accessPem = path.join(__dirname, '../../../../certs/private_access.pem')
      const accessSecret = await fs.readFile(accessPem, 'utf-8')
      const accessToken = jwt.sign(accessPayload, accessSecret, { expiresIn: '15m', algorithm: 'RS256'})

      return { accessToken, nombre: usuario.nombre }
    } catch (error) {
      throw boom.unauthorized(error.message)
    }
  }

  async registroUsuario(nombre, correo, password){
    const usuario = await service.findOneByCorreo(correo)

    if (usuario) {
      throw boom.badRequest('El correo ya está registrado')
    }

    const tipoUsuario = await tipoUsuarioService.findOneByClave('cliente')

    const usuarioCreado = await service.create({ nombre, correo, password, tipoUsuarioId: tipoUsuario.id })
    return usuarioCreado
  }

  async changePassword(token, newPassword){
    try {
      const payload = jwt.verify(token, config.JWT_RECOVERY_SECRET)
      const usuario = await service.findOneWithRecovery(payload.sub)
      if (usuario.recoveryToken !== token){
        throw boom.unauthorized()
      }
      await service.update(usuario.id, { recoveryToken: null, password: newPassword })
      return { message: 'Contraseña actualizada correctamente' }
    } catch (error) {
      throw boom.unauthorized()
    }
  }

}

export { AuthService }