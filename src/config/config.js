import { config as conf } from 'dotenv'

conf()

const config = {
  ENV: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3000,
  PG_HOST: process.env.PG_HOST || 'localhost',
  PG_PORT: process.env.PG_PORT || 5432,
  PG_USER: process.env.PG_USER || 'postgres',
  PG_PASS: process.env.PG_PASS || '',
  PG_DB: process.env.PG_DB || 'db',
  API_KEY: process.env.API_KEY || 'myapikey',
  JWKS_ACCESS_URI: process.env.JWKS_ACCESS_URI || 'http://localhost:3000/public/.well-known/jwks_access.json',
  JWKS_REFRESH_URI: process.env.JWKS_REFRESH_URI || 'http://localhost:3000/public/.well-known/jwks_refresh.json',
  JWKS_RECOVERY_URI: process.env.JWKS_RECOVERY_URI || 'http://localhost:3000/public/.well-known/jwks_recovery.json',
  API_KEY_ENCRYPTION_PASSWORD: process.env.API_KEY_ENCRYPTION_PASSWORD || 'myencryptionpassword',
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}

export { config }