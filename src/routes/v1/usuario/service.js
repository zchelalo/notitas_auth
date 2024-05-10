import boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'
import path from 'path'

import { sequelize } from '../../../libs/sequelize.js'

const UsuarioModel = sequelize.models.Usuario
const TipoUsuarioModel = sequelize.models.TipoUsuario

class UsuarioService {
  constructor(){}

  async create(data) {
    const usuario = await this.findOneByCorreo(data.correo)
    if (usuario) {
      throw boom.badRequest('El correo ya está registrado')
    }

    let imageUrl = undefined

    // Procesar el archivo de imagen
    if (data.profilePic) {
      const profilePic = data.profilePic
      if (!profilePic.mimetype.startsWith('image/')) {
        throw boom.badRequest('Se requiere una imagen válida')
      }
  
      // Generar un nombre único para la imagen
      const __dirname = path.dirname(fileURLToPath(import.meta.url))
      const fileName = `${uuidv4()}${path.extname(profilePic.name)}`
      const filePath = path.join(__dirname, '../../../', 'public', 'images', 'pfp', fileName) // Ruta donde se guardará el archivo

      try {
        // Guardar el archivo en el servidor
        await profilePic.mv(filePath)
        const reqUrl = data.reqUrl // Suponiendo que tienes acceso a la URL de la solicitud
        imageUrl = new URL(path.join('notitas_auth', 'public', 'images', 'pfp', fileName), reqUrl).toString()
      } catch (error) {
        throw boom.internal('Error al guardar la imagen')
      }
    }
    
    const newUsuario = await UsuarioModel.create({
      ...data,
      profilePic: imageUrl // Guardar la ruta del archivo en la base de datos
    })
    delete newUsuario.dataValues.password

    return newUsuario
  }

  async find() {
    const response = await UsuarioModel.findAll({
      // attributes: ['id', 'email', 'role', 'createdAt']
      include: 'tipoUsuario',
      attributes: { exclude: ['password', 'recoveryToken'] }
    })
    return response
  }

  async findOne(id) {
    const usuario = await UsuarioModel.findByPk(id, {
      include: [
        {
          model: TipoUsuarioModel,
          as: 'tipoUsuario',
          attributes: ['id', 'clave']
        }
      ],
      attributes: { exclude: ['password', 'recoveryToken'] }
    })
    if (!usuario){
      throw boom.notFound('Usuario no encontrado')
    }
    return usuario
  }

  async findOneWithRecovery(id) {
    const usuario = await UsuarioModel.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    if (!usuario){
      throw boom.notFound('Usuario no encontrado')
    }
    return usuario
  }

  async findOneByCorreo(correo) {
    const usuario = await UsuarioModel.findOne({
      where: { correo }
    })
    return usuario
  }

  async update(id, changes) {
    const usuario = await this.findOne(id)
    const response = await usuario.update(changes)
    return response
  }

  async delete(id) {
    const usuario = await this.findOne(id)
    await usuario.destroy()
    return { id }
  }
}

export { UsuarioService }