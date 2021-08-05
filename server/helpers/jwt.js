const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

    return new Promise( ( resolve, reject ) => {

        //esto ira con el token para firmar 
        const payload = {
            uid,
        };
    
        //esto es par crear el token 
        jwt.sign( payload, process.env.JWT_SECRET, {
            //duracion del token
            expiresIn: '12h'
            //este colback genera un token y un error 
        }, ( err, token ) => {
    
            if ( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
    
        });

    });

}


module.exports = {
    generarJWT,
}