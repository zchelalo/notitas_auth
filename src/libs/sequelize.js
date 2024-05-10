import { Sequelize } from "sequelize"
import { config } from "../config/config.js"
import { setupModels } from "../models/index.js"

const PG_USER = encodeURIComponent(config.PG_USER)
const PG_PASS = encodeURIComponent(config.PG_PASS)
const URI = `postgres://${PG_USER}:${PG_PASS}@${config.PG_HOST}:${config.PG_PORT}/${config.PG_DB}`

const sequelize = new Sequelize(URI, {
  dialect: 'postgres',
  logging: (str) => {
    console.log(str)
  }
})

setupModels(sequelize)

export { sequelize }