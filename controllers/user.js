const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

/*** Método de Inicio ***/
const home = async(req = request, res = response) => {
    res.json({
        mensaje: "Hola mundo"
    });
}

const saveUser = async(req = request, res = response) => {
    try {
        const { name, email, password, rol } = req.body;
        const user = new User(req.body);

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
        // // Guardar en BD
        await user.save();
        res.json({
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
}


const updateUser = async(req, res = response) => {

    try {
        const { id } = req.params;
        const {...resto } = req.body;

        const user = await User.findByIdAndUpdate(id, resto);
        res.json({
            user
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }

}

const userPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const userDelete = async(req, res = response) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, { status: false });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
}
module.exports = {
    home,
    saveUser,
    updateUser,
    userPatch,
    userDelete
}