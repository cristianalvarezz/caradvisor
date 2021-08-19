const jwt = require('jsonwebtoken');



const generarJWT = (uid = '') => {

    return new Promise((resolve, reject) => {

        const payload = { uid };
        console.log(Object.values('Holsdj28397kjHd7@asdyui3897k'));
        jwt.sign(payload, 'Holsdj28397kjHd7@asdyui3897k', {
            expiresIn: '4h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token')
            } else {
                resolve(token);
            }
        })

    })
}




module.exports = {
    generarJWT
}