const User = require("../models/user");
const validatefriend = async(req, res, next) => {
    // // if these two become the same it means that it is a user trying to update itself
    const uid = req.params.id;
    const campos = req.body;
    let idfriend = '';
    Object.entries(campos).forEach(([key, value]) => {
        idfriend = value;
    });

    const userDB = await User.findById(uid);
    try {
        await User.findById(idfriend);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "El amigo a quien intenta agregar no existe",
        });
    }
    if (!userDB) {
        return res.status(404).json({
            ok: false,
            msg: "There is no user for that id",
        });
    }
    next();
}

const validatenorepeat = async(req, res, next) => {
    // // if these two become the same it means that it is a user trying to update itself
    const uid = req.params.id;
    const campos = req.body;
    let idfriend = '';
    Object.entries(campos).forEach(([key, value]) => {
        idfriend = value;
    });

    const userDB = await User.findById(uid);
    try {
        await User.findById(idfriend);
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "El amigo a quien intenta agregar no existe",
        });
    }
    if (!userDB) {
        return res.status(404).json({
            ok: false,
            msg: "There is no user for that id",
        });
    }
    next();
}
module.exports = {
    validatefriend
}