import boom from '@hapi/boom'

function checkRoles(...roles){
  return (req, res, next) => {
    const usuario = req.user
    if (roles.includes(usuario.rol)){
      next()
    }
    else{
      next(boom.unauthorized())
    }
  }
}

export { checkRoles }