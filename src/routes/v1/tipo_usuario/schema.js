import Joi from 'joi'

const id = Joi.number().integer()

const getTiposUsuarioSchema = Joi.object({
  id: id.required()
})

export { getTiposUsuarioSchema }