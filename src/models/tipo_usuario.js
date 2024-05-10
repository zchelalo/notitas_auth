import { Model, DataTypes, Sequelize } from 'sequelize'

const TIPO_USUARIO_TABLE = 'tipos_usuario'

const TipoUsuarioSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  clave: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
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

class TipoUsuario extends Model {
  static associate(models){
    this.hasMany(models.Usuario, { as: 'usuarios', foreignKey: 'tipoUsuarioId' })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: TIPO_USUARIO_TABLE,
      modelName: 'TipoUsuario',
      timestamps: true
    }
  }
}

export { TIPO_USUARIO_TABLE, TipoUsuarioSchema, TipoUsuario }