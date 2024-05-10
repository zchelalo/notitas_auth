import { Model, DataTypes, Sequelize } from 'sequelize'
import bcrypt from 'bcrypt'

const USUARIO_TABLE = 'usuarios'

const UsuarioSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING
  },
  profilePic: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'profile_pic'
  },
  correo: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  recoveryToken: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'recovery_token'
  },
  tipoUsuarioId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'tipo_usuario_id'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW
  }
}

class Usuario extends Model {
  static associate(models){
    this.belongsTo(models.TipoUsuario, { as: 'tipoUsuario', foreignKey: 'tipoUsuarioId' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: USUARIO_TABLE,
      modelName: 'Usuario',
      timestamps: true,
      hooks: {
        beforeCreate: async (usuario, options) => {
          const password = await bcrypt.hash(usuario.password, 10)
          usuario.password = password
        },
        beforeUpdate: async (usuario, options) => {
          // Verifica si la contraseña ha sido modificada antes de hacer el hash nuevamente
          if (usuario.changed('password')) {
            const password = await bcrypt.hash(usuario.password, 10)
            usuario.password = password
          }
        }
      }
    }
  }
}

export { USUARIO_TABLE, UsuarioSchema, Usuario }