import express from 'express'
import passport from 'passport'

import { UsuarioService } from './service.js'
import { checkRoles } from '../../../middlewares/auth.handler.js'
import { validatorHandler } from '../../../middlewares/validator.handler.js'
import { updateUsuarioSchema, createUsuarioSchema, getUsuarioSchema } from './schema.js'

const router = express.Router()
const service = new UsuarioService()

router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), async (req, res, next) => {
  try {
    const usuarios = await service.find()
    res.json(usuarios)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', passport.authenticate('jwt', { session: false }), checkRoles('admin'), validatorHandler(getUsuarioSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    const usuario = await service.findOne(id)
    res.json(usuario)
  } catch (error) {
    next(error)
  }
})

// router.post('/', checkRoles('admin'), validatorHandler(createUsuarioSchema, 'body'), async (req, res, next) => {
router.post('/', async (req, res, next) => {
  try {
    const usuarios = await service.find()
    if (usuarios.length === 0) {
      req.customData = {
        noUsers: true
      }
      next()
    } else {
      passport.authenticate('jwt', { session: false })(req, res, next)
    }
  } catch (e) {
    next(e)
  }
}, async (req, res, next) => {
  try {
    if (req.customData && req.customData.noUsers) {
      next()
    } else {
      checkRoles('admin')(req, res, next)
    }
  } catch (e) {
    next(e)
  }
}, validatorHandler(createUsuarioSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body
    if (req.files) {
      // Aquí obtienes la URL de la solicitud
      const reqUrl = req.protocol + '://' + req.get('host')
      body.profilePic = req.files.profilePic
      body.reqUrl = reqUrl
    }
    const newUsuario = await service.create(body)
    res.status(201).json(newUsuario)
  } catch (error) {
    next(error)
  }
})

router.patch('/:id', passport.authenticate('jwt', { session: false }), checkRoles('admin'), validatorHandler(getUsuarioSchema, 'params'), validatorHandler(updateUsuarioSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params
    const body = req.body
    if (req.files) {
      // Aquí obtienes la URL de la solicitud
      const reqUrl = req.protocol + '://' + req.get('host')
      body.profilePic = req.files.profilePic
      body.reqUrl = reqUrl
    }
    const usuario = await service.update(id, body)
    res.json(usuario)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), checkRoles('admin'), validatorHandler(getUsuarioSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params
    await service.delete(id)
    res.status(201).json({id})
  } catch (error) {
    next(error)
  }
})

export { router }