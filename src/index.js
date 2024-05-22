import express from 'express'
import cors from 'cors'
import fileUpload from 'express-fileupload'
import { fileURLToPath } from 'url'
import path from 'path'
import cookieParser from 'cookie-parser'

import { config } from "./config/config.js"
import { routerApi } from './routes/index.js'
import { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } from './middlewares/error.handler.js'

import passport from 'passport'
import './utils/auth/index.js'

const app = express()
const port = config.PORT

app.use(express.json())
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/public', express.static(path.join(__dirname, 'public')))

const whitelist = ['chrome-extension://amknoiejhlmhancpahfcfcfhllgkpbld', 'http://notitas_back']
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('no permitido'))
    }
  }
}
app.use(cors(options))

app.use(passport.initialize())

app.use(fileUpload())

routerApi(app)

app.use(logErrors)
app.use(ormErrorHandler)
app.use(boomErrorHandler)
app.use(errorHandler)

app.listen(port, () => {
  console.log('Aplicación ejecutandose en el puerto', port)
})