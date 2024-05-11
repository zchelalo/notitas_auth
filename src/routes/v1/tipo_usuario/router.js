import express from 'express'

import { TipoUsuarioService } from './service.js'
import { checkRoles } from '../../../middlewares/auth.handler.js'
import { validatorHandler } from '../../../middlewares/validator.handler.js'
import { getTiposUsuarioSchema } from './schema.js'

const router = express.Router()
const service = new TipoUsuarioService()

router.get('/', checkRoles('admin'), async (req, res, next) => {
  try {
    const tiposUsuarios = await service.find()
    res.json(tiposUsuarios)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', checkRoles('admin'), validatorHandler(getTiposUsuarioSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    const tiposUsuario = await service.findOne(id)
    res.json(tiposUsuario)
  } catch (error) {
    next(error)
  }
})

export { router }