import Joi from 'joi'

const id = Joi.number().integer()
const nombre = Joi.string().min(1)

const correo = Joi.string().email()
const password = Joi.string().min(8)
const tipoUsuarioId = Joi.number().integer()

const createUsuarioSchema = Joi.object({
  nombre: nombre.required(),
  correo: correo.required(),
  password: password.required(),
  tipoUsuarioId: tipoUsuarioId.required()
})

const updateUsuarioSchema = Joi.object({
  nombre,
  correo,
  tipoUsuarioId
})

const getUsuarioSchema = Joi.object({
  id: id.required()
})

export { createUsuarioSchema, updateUsuarioSchema, getUsuarioSchema }