import express from 'express'

import { router as authRouter } from './auth/router.js'
import { router as usuarioRouter } from './usuario/router.js'
import { router as tipoUsuarioRouter } from './tipo_usuario/router.js'

function routerApi(app) {
  const router = express.Router()
  app.use('/v1', router)
  router.use('/auth', authRouter)
  router.use('/usuarios', usuarioRouter)
  router.use('/tipos_usuario', tipoUsuarioRouter)
}

export { routerApi }