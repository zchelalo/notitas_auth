import { Strategy } from 'passport-local'
import { AuthService } from '../../../routes/v1/auth/service.js'

const service = new AuthService()

const LocalStrategy = new Strategy({ usernameField: 'correo', passwordField: 'password' }, async (correo, password, done) => {
  try {
    const usuario = await service.getUsuario(correo, password)
    done(null, usuario)
  } catch (error) {
    done(error, false)
  }
})

export { LocalStrategy }