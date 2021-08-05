//tener la auidas de auto completado
const { response } = require("express");
//traigo los modelos
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
//importo libreria para encriptar la contraseña
const bcrypt = require("bcryptjs");

const getUsuarios = async(req, res) => {
    const desde = Number(req.query.desde) || 0;
    console.log(desde);
    //coleccion de promeas usuarios primera posicion del arreglo, total la segunda
    const [usuarios, total] = await Promise.all([
        //a si especifico los campos
        //const usuarios = await Usuario.find({},'nombre');
        Usuario.find({}, 'nombre email role google img')
        .skip(desde)
        // argumentos de limite para recibir
        .limit(5),
        //contar los registros que hay
        Usuario.count(),
    ]);
    res.json({
        ok: true,
        //aqui voy a retornar toda la coleccion de usuarios
        usuarios,
        uid: req.uid,
        total,
    });
};

const crearUsuario = async(req, res = response) => {
    //en la req viene lo que la persona esta solicitando
    //paso los atributos aqui
    const { email, password, nombre } = req.body;
    try {
        //validar un correo
        //busco si el email ya esta y esto es una promesa
        const exiteEmail = await Usuario.findOne({ email });
        if (exiteEmail) {
            //en caso de que el correo ya este registrado me devuelve esto
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado",
            });
        }
        //lo paso al modelo del usuario
        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        //genero numero de manera aleatoria
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //
        //necesito esperar a que esta promesa termine antes de continuar con las siguientes lineas de codigo
        await usuario.save();
        //genero el token para mostrarlo
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            //aqui voy a retornar toda la coleccion de usuarios
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Error inesperado ",
        });
    }
};
//Acutualizar usuario
const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}
const borrarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "No existe un usuario por ese id  ",
            });
        }
        await Usuario.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: "Usuario Eliminado",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error inesperado ",
        });
    }
};
//no olvida exportar
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
};