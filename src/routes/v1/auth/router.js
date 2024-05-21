import express from 'express'
import passport from 'passport'
import { validatorHandler } from '../../../middlewares/validator.handler.js'
import { loginSchema, registroSchema, recoverySchema, changePasswordSchema } from './schema.js'
import { AuthService } from './service.js'
import { CorreoService } from '../../../services/correo.js'

const router = express.Router()
const service = new AuthService()
const correoService = new CorreoService()

router.post('/login', validatorHandler(loginSchema, 'body'), passport.authenticate('local', { session: false }), async (req, res, next) => {
  try {
    const token = await service.signToken(req.user)

    res.json(token)
  } catch (error) {
    next(error)
  }
})

router.post('/registro', validatorHandler(registroSchema, 'body'), async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body
    const usuario = await service.registroUsuario(nombre, correo, password)

    const token = await service.signToken(usuario)

    res.status(201).json(token)
  } catch (error) {
    next(error)
  }
})

router.post('/recuperar', validatorHandler(recoverySchema, 'body'), async (req, res, next) => {
  try {
    const { correo } = req.body
    const respuesta = await correoService.sendRecovery(correo)
    res.json(respuesta)
  } catch (error) {
    next(error)
  }
})

router.post('/cambiar-password', validatorHandler(changePasswordSchema, 'body'), async (req, res, next) => {
  try {
    const { recoveryToken, newPassword } = req.body
    const respuesta = await service.changePassword(recoveryToken, newPassword)
    res.json(respuesta)
  } catch (error) {
    next(error)
  }
})

export { router }