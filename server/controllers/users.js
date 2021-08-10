//tener la auidas de auto completado
const { response } = require("express");
//traigo los modelos
const User = require("../models/user");

const { generateJWT } = require("../helpers/jwt");
//importo libreria para encriptar la contraseña
const bcrypt = require("bcryptjs");

const getUsers = async(req, res) => {
    const showpag = Number(req.query.showpag) || 0;
    //collection of promises users firs positions of array, total the second
    const [users, total] = await Promise.all([
        // i specify the flieds
        User.find({}, "name email role google img")
        .skip(showpag)
        // argumentos de limite para recibir
        .limit(5),
        //contar los registros que hay
        User.count(),
    ]);
    res.json({
        ok: true,
        //aqui voy a retornar toda la coleccion de usuarios
        users,
        uid: req.uid,
        total,
    });
};

const createUser = async(req, res = response) => {
    // in the req comes what the person is requesting
    // pass the attributes here
    const { email, password, name, phone } = req.body;
    try {
        // validate an email
        // I search if the email is already there and this is a promise
        const existEmail = await User.findOne({ email });
        if (existEmail) {
            //// in case the email is already registered, it returns this to me
            return res.status(400).json({
                ok: false,
                msg: "The email is already registered",
            });
        }
        //I pass it to the user model
        const user = new User(req.body);

        // Encrypt password
        // I generate number randomly
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        //
        //I need to wait for this promise to finish before continuing with the next lines of code
        await user.save();
        //genero el token para mostrarlo
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            //aqui voy a retornar toda la coleccion de usuarios
            user,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
};

//Update usuario
const updateUser = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: "There is no user for that id",
            });
        }

        // updates
        const { password, google, email, ...campos } = req.body;

        if (userDB.email !== email) {
            const existEmail = await User.findOne({ email });
            if (existEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: "There is already a user with that email",
                });
            }
        }

        if (!userDB.google) {
            campos.email = email;
        } else if (userDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: " Google user cannot change their email",
            });
        }

        const updateduser = await User.findByIdAndUpdate(uid, campos, {
            new: true,
        });

        res.json({
            ok: true,
            user: updateduser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Unexpected error",
        });
    }
};
const deleteUser = async(req, res = response) => {
    const uid = req.params.id;

    try {
        const userDB = await User.findById(uid);

        if (!userDB) {
            return res.status(404).json({
                ok: false,
                msg: "There is no user for that id ",
            });
        }
        await User.findByIdAndDelete(uid);
        res.json({
            ok: true,
            msg: "User Deleted",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unexpected error ",
        });
    }
};

//Update usuario
const addfriend = async(req, res = response) => {
    // TODO: Validar token y comprobar si es el usuario correcto
    const uid = req.params.id;
    const campos = req.body;
    let idfriend = '';

    Object.entries(campos).forEach(([key, value]) => {
        idfriend = value;
    });
    try {
        if (campos) {
            // console.log(campos)
            // const prueba = User.friends.push(idfriend);
            // console.log(prueba);
            const updateduser = await User.findByIdAndUpdate(uid, { $push: { friends: [idfriend] } }, {
                new: true,
            });
            res.json({
                ok: true,
                user: updateduser
            });
        }
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Unexpected error",
        });
    }
};

const deletefriend = async(req, res = response) => {
        const uid = req.params.id;
        const campos = req.body;
        Object.entries(campos).forEach(([key, value]) => {
            idfriend = value;
        });

        const userDB = await User.findById(uid);
        console.log(userDB);
        res.json({
            ok: true,
            user: campos
        });

    }
    //no olvida exportar
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    addfriend,
    deletefriend
};