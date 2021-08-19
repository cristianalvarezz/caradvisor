const { response } = require('express');
const bcryptjs = require('bcryptjs')

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const login = async(req, res = response) => {
    const { email, password } = req.body;
    try {
        // Verificar si el email existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }
        // SI el usuario está activo
        if (!user.status) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }
        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        // Generar el JWT
        const token = await generarJWT(user.id);
        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }
}
module.exports = {
    login
}