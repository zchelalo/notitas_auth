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

  async signToken(usuario) {
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
    const accessToken = jwt.sign(accessPayload, accessSecret, { expiresIn: `${config.VENCIMIENTO_ACCESS_TOKEN_MINUTOS}m`, algorithm: 'RS256'})

    const refreshPem = path.join(__dirname, '../../../../certs/private_refresh.pem')
    const refreshSecret = await fs.readFile(refreshPem, 'utf-8')
    const refreshToken = jwt.sign(refreshPayload, refreshSecret, { expiresIn: `${config.VENCIMIENTO_REFRESH_TOKEN_DIAS}d`, algorithm: 'RS256'})

    return { accessToken, refreshToken, nombre: usuario.nombre }
  }

  async refreshToken(token) {
    try {
      const client = jwksClient({
        jwksUri: config.JWKS_REFRESH_URI,
        cache: true,
        rateLimit: true,
        timeout: 30000 // Defaults to 30s
      })

      const __dirname = path.dirname(fileURLToPath(import.meta.url))

      const key = await client.getSigningKey()

      const refreshDedoded = jwt.verify(token, key.getPublicKey())

      const tiempoExpiracion = refreshDedoded.exp * 1000 // Convertir a milisegundos
      const tiempoActual = Date.now()
      const tiempoRestante = tiempoExpiracion - tiempoActual
      const tiempoRestanteDias = tiempoRestante / (1000 * 60 * 60 * 24)

      let refreshToken = undefined

      const usuario = await service.findOne(refreshDedoded.sub)

      if (tiempoRestanteDias <= (parseInt(config.VENCIMIENTO_REFRESH_TOKEN_DIAS) / 2)){
        const refreshPayload = {
          sub: usuario.id
        }

        const refreshPem = path.join(__dirname, '../../../../certs/private_refresh.pem')
        const refreshSecret = await fs.readFile(refreshPem, 'utf-8')
        refreshToken = jwt.sign(refreshPayload, refreshSecret, { expiresIn: `${config.VENCIMIENTO_REFRESH_TOKEN_DIAS}d`, algorithm: 'RS256'})
      }

      const tipoUsuario = await tipoUsuarioService.findOne(usuario.tipoUsuarioId)

      const accessPayload = {
        sub: usuario.id,
        rol: tipoUsuario.clave
      }

      const accessPem = path.join(__dirname, '../../../../certs/private_access.pem')
      const accessSecret = await fs.readFile(accessPem, 'utf-8')
      const accessToken = jwt.sign(accessPayload, accessSecret, { expiresIn: `${config.VENCIMIENTO_ACCESS_TOKEN_MINUTOS}m`, algorithm: 'RS256'})

      return { refreshToken, accessToken, nombre: usuario.nombre }
    } catch (error) {
      throw boom.unauthorized(error.message)
    }
  }

  async registroUsuario(nombre, correo, password) {
    const usuario = await service.findOneByCorreo(correo)

    if (usuario) {
      throw boom.badRequest('El correo ya está registrado')
    }

    const tipoUsuario = await tipoUsuarioService.findOneByClave('cliente')

    const usuarioCreado = await service.create({ nombre, correo, password, tipoUsuarioId: tipoUsuario.id })
    return usuarioCreado
  }

  async sendRecovery(correo) {
    const usuario = await service.findOneByCorreo(correo)

    if (!usuario){
      throw boom.unauthorized()
    }

    const recoveryPayload = { sub: usuario.id }

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    const recoveryPem = path.join(__dirname, '../../../../certs/private_recovery.pem')
    const recoverySecret = await fs.readFile(recoveryPem, 'utf-8')
    const recoveryToken = jwt.sign(recoveryPayload, recoverySecret, { expiresIn: '10m', algorithm: 'RS256'})

    const link = `http://localhost/recuperar?token=${recoveryToken}`

    let info = {
      from: 'Notitas', // sender address
      to: `${usuario.correo}`, // list of receivers
      subject: 'Correo de recuperación de contraseña', // Subject line
      html: `<b>Recupere su contraseña ingresando al siguiente link</b><br /><a href="${link}">Recovery</a>`, // html body
    }

    const respuesta = await fetch('http://notitas_email:3000/api/v1/correo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(info)
    })

    if (!respuesta.ok) {
      throw boom.badImplementation('Error al enviar el correo de recuperación de contraseña')
    }

    await service.update(usuario.id, { recoveryToken })

    const data = await respuesta.json()

    return data
  }

  async changePassword(token, newPassword) {
    try {
      const client = jwksClient({
        jwksUri: config.JWKS_RECOVERY_URI,
        cache: true,
        rateLimit: true,
        timeout: 30000 // Defaults to 30s
      })

      const key = await client.getSigningKey()

      const recoveryPayload = jwt.verify(token, key.getPublicKey())

      const usuario = await service.findOneWithRecovery(recoveryPayload.sub)
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