import { TipoUsuario, TipoUsuarioSchema } from './tipo_usuario.js'
import { Usuario, UsuarioSchema } from './usuario.js'

function setupModels(sequelize){
  TipoUsuario.init(TipoUsuarioSchema, TipoUsuario.config(sequelize))
  Usuario.init(UsuarioSchema, Usuario.config(sequelize))

  TipoUsuario.associate(sequelize.models)
  Usuario.associate(sequelize.models)
}

export { setupModels }