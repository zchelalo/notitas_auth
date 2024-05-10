import express from 'express'
import passport from 'passport'
import { validatorHandler } from '../../../middlewares/validator.handler.js'
import { loginSchema, recoverySchema, changePasswordSchema } from './schema.js'
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
    const { token, newPassword } = req.body
    const respuesta = await service.changePassword(token, newPassword)
    res.json(respuesta)
  } catch (error) {
    next(error)
  }
})

export { router }