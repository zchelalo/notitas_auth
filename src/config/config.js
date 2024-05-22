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
  
  JWKS_ACCESS_URI: process.env.JWKS_ACCESS_URI || 'http://localhost:3000/public/.well-known/jwks_access.json',
  JWKS_REFRESH_URI: process.env.JWKS_REFRESH_URI || 'http://localhost:3000/public/.well-known/jwks_refresh.json',
  JWKS_RECOVERY_URI: process.env.JWKS_RECOVERY_URI || 'http://localhost:3000/public/.well-known/jwks_recovery.json',

  VENCIMIENTO_ACCESS_TOKEN_MINUTOS: process.env.VENCIMIENTO_ACCESS_TOKEN_MINUTOS || 15,
  VENCIMIENTO_REFRESH_TOKEN_DIAS: process.env.VENCIMIENTO_REFRESH_TOKEN_DIAS || 15,

  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}

export { config }