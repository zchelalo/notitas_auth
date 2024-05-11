import { Strategy, ExtractJwt } from 'passport-jwt'
import jwksClient from 'jwks-rsa'
import { config } from '../../../config/config.js'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKeyProvider: jwksClient.passportJwtSecret({
    jwksUri: config.JWKS_URI,
    cache: true,
    rateLimit: true,
    timeout: 30000 // Defaults to 30s
  }),
  algorithms: ['RS256']
}

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload)
})

export { JwtStrategy }