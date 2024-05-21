import Joi from 'joi'

const nombre = Joi.string().min(3).max(255)
const correo = Joi.string().email()
const password = Joi.string().min(8)
const recoveryToken = Joi.string().regex(/^[A-Za-z0-9-_]+.[A-Za-z0-9-_]+.[A-Za-z0-9-_.+/=]*$/)

const loginSchema = Joi.object({
  correo: correo.required(),
  password: password.required()
})

const registroSchema = Joi.object({
  nombre: nombre.required(),
  correo: correo.required(),
  password: password.required()
})

const recoverySchema = Joi.object({
  correo: correo.required()
})

const changePasswordSchema = Joi.object({
  recoveryToken: recoveryToken.required(),
  newPassword: password.required()
})

export { loginSchema, registroSchema, recoverySchema, changePasswordSchema }