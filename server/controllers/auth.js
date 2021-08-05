const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const { generateJWT } = require("../helpers/jwt");



const login = async(req, res = response) => {
    //atrapo el email y password
    const { email, password } = req.body;

    try {
        // Verificar email
        const userDB = await User.findOne({ email });

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: "Email not found",
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, userDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Invalid password",
            });
        }

        // Generar el TOKEN - JWT
        const token = await generateJWT(userDB.id);

        res.json({
            ok: true,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Talk to the administrator",
        });
    }
};

// const googleSignIn = async(req, res = response) => {
//     //recibo el token donde obtendre un email, un nombre y una imagen
//     const googleToken = req.body.token;

//     try {
//         //el await es para que se espere antes de hacer cualquier cosa
//         //con esto podre mandar el token verificarlo y recuperar email,nombre y imagen
//         const { name, email, picture } = await googleVerify(googleToken);
//         //verifico si el usuario exite
//         const usuarioDB = await Usuario.findOne({ email });
//         let usuario;
//         //si el usuario no exite
//         if (!usuarioDB) {
//             // si no existe el usuario
//             usuario = new Usuario({
//                 nombre: name,
//                 email,
//                 password: "@@@",
//                 img: picture,
//                 google: true,
//             });
//         }
//         //si exite el usuario
//         else {
//             // existe usuario
//             //este google true quiere decir que es un usuario registrado con google
//             usuario = usuarioDB;
//             usuario.google = true;
//         }

//         // Guardar en DB
//         await usuario.save();

//         // Generar el TOKEN - JWT
//         const token = await generarJWT(usuario.id);

//         res.json({
//             ok: true,
//             token,
//             //esto para crear el rol
//             menu: getMenuFrontEnd(usuario.role)
//         });
//     } catch (error) {
//         res.status(401).json({
//             ok: false,
//             msg: "Token no es correcto",
//         });
//     }
// };
//renovar token

const renewToken = async(req, res = response) => {
    const uid = req.uid;
    // Para generar un nuevo token solo necesito el id del usuario
    const token = await generateJWT(uid);
    //regreso nuevo token para dispararlo cuando la persona essta renovada
    const user = await User.findById(uid);
    //recupero el usuario
    res.json({
        ok: true,
        token,
        user,
    });
};

module.exports = {
    login,
    renewToken,

};