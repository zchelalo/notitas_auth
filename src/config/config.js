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
  JWT_SECRET: process.env.JWT_SECRET || 'mysecret',
  JWT_RECOVERY_SECRET: process.env.JWT_RECOVERY_SECRET || 'myrecoverysecret',
  API_KEY_ENCRYPTION_PASSWORD: process.env.API_KEY_ENCRYPTION_PASSWORD || 'myencryptionpassword',
  EMAIL_SERVER: process.env.EMAIL_SERVER,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_SECURE: process.env.EMAIL_SECURE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
}

export { config }