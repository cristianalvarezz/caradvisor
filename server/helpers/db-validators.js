const Role = require('../models/role');
const User = require('../models/user');

const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async(email = '') => {

    // Verificar si el correo existe
    const existeEmail = await User.findOne({ email });
    if (existeEmail) {
        throw new Error(`El correo: ${ email }, ya está registrado`);
    }
}
const nickExiste = async(nick = '') => {

    // Verificar si el correo existe
    const existenick = await User.findOne({ nick });
    if (existenick) {
        throw new Error(`El nick: ${ nick }, ya está registrado`);
    }
}

const existeUsuarioPorId = async(id) => {

    // Verificar si el correo existe
    const existeUsuario = await User.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id no existe ${ id }`);
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
}