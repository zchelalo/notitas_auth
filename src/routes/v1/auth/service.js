import boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import path from 'path'

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
    const payload = {
      sub: usuario.id,
      rol: tipoUsuario.clave
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const privatePem = path.join(__dirname, '../../../../certs/private.pem')
    const secret = await fs.readFile(privatePem, 'utf-8')

    const token = jwt.sign(payload, secret, { expiresIn: '2h', algorithm: 'RS256'})
    return { token, nombre: usuario.nombre }
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