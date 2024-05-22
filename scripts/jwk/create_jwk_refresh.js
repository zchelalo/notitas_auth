import fs from 'fs'
import path from 'path'
import jose from 'node-jose'

const rutaCerts = path.resolve(process.cwd(), 'certs')

const refreshPem = fs.readFileSync(path.resolve(rutaCerts, 'private_refresh.pem'))

let obj = {
  keys: []
}

async function pemToJwk(pemKey) {
  const key = await jose.JWK.asKey(pemKey, 'pem')
  return key.toJSON()
}

async function convertPemToJwk(pem) {
  try {
    const jwk = await pemToJwk(pem)
    obj.keys.push(jwk)
  } catch (error) {
    console.error('Error al convertir PEM a JWK:', error)
  }
}

await convertPemToJwk(refreshPem)

console.log(JSON.stringify(obj, null, 2))