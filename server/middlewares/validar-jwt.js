const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = (req, res, next) => {

    // Leer el Token
    const token = req.header('x-token');

    //verifico el token en este punto 
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    //verifico el json web token 
    try {
        //esto intentara comprboar el ide con el token y la firma 
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
 
}
const varlidarADMIN_ROLE = async(req, res, next)  => {

    const uid = req.uid;
    
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( usuarioDB.role !== 'ADMIN_ROLE' ) {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }

        next();


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

//esto va a impedir a un usuario no administrador borre otros usuarios 
const varlidarADMIN_ROLE_o_MismoUsuario = async(req, res, next)  => {

    //si estos dos llegan a ser iguales quiere decir que es un usuario que intenta actualizarse a si mismo 
    const uid = req.uid;
    const id  = req.params.id;
  
    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }
      
        if ( usuarioDB.role === 'ADMIN_ROLE' || uid === id ) {
     
            next();
            
        } else {
            //en caso de no serlo no tiene permisos para borrar 
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}



module.exports = {
    validarJWT,
    varlidarADMIN_ROLE,
    varlidarADMIN_ROLE_o_MismoUsuario
}