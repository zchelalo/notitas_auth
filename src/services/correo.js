import boom from '@hapi/boom'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

import { config } from '../config/config.js'
import { UsuarioService } from '../routes/v1/usuario/service.js'

const service = new UsuarioService()

class CorreoService {
  constructor(){}

  async sendRecovery(correo){
    const usuario = await service.findByCorreo(correo)

    if (!usuario){
      throw boom.unauthorized()
    }

    const payload = { sub: usuario.id }
    const token = jwt.sign(payload, config.JWT_RECOVERY_SECRET, { expiresIn: '10m' })
    const link = `http://myfrontend.com/recuperar?${token}`

    const usuarioUpdated = await service.update(usuario.id, { recoveryToken: token })

    let info = {
      from: `"Aplicación" <${config.EMAIL_USER}>`, // sender address
      to: `${usuario.correo}`, // list of receivers
      subject: "Correo de recuperación de contraseña", // Subject line
      html: `<b>Recupere su contraseña ingresando al siguiente link</b><br /><a href="${link}">Recovery</a>`, // html body
    }

    const respuesta = await this.sendCorreo(info)
    return respuesta
  }

  async sendCorreo(infoCorreo){
    const transporter = nodemailer.createTransport({
      host: config.EMAIL_SERVER,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      }
    })

    let info = await transporter.sendMail(infoCorreo)

    // console.log("Message sent: %s", info.messageId)
    return { msg: 'Correo enviado' }
  }

}

export { CorreoService }