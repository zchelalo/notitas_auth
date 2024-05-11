import fs from 'fs'
import path from 'path'
import jose from 'node-jose'

const rutaCerts = path.resolve(process.cwd(), 'certs')
const privatePem = fs.readFileSync(path.resolve(rutaCerts, 'private.pem'))

async function pemToJwk(pemKey) {
  const key = await jose.JWK.asKey(pemKey, 'pem')
  return key.toJSON()
}

async function convertPemToJwk() {
  try {
    const jwk = await pemToJwk(privatePem)
    const obj = {
      keys: [jwk]
    }
    console.log(JSON.stringify(obj, null, 2))
  } catch (error) {
    console.error('Error al convertir PEM a JWK:', error)
  }
}

convertPemToJwk()