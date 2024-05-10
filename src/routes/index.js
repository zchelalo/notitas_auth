import express from 'express'

import { routerApi as v1RouterApi } from './v1/index.js'

function routerApi(app) {
  const router = express.Router()
  app.use('/api', router)
  v1RouterApi(router)
}

export { routerApi }