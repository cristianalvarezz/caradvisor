/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");
const {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
} = require("../controllers/usuarios");
//importo el paquete  de validaciones
const { check } = require("express-validator");
const router = Router();
//importo validaciones
const { validarCampos } = require("../middlewares/validar-campos");
//calidar token
const {
    validarJWT,
    varlidarADMIN_ROLE,
    varlidarADMIN_ROLE_o_MismoUsuario
} = require("../middlewares/validar-jwt");

//obtener usuarios
router.get(
    "/",
    validarJWT,
    getUsuarios
);
//crear usuario
//el middleware son funciones que siempre se van a ejecutar
router.post(
    "/", [
        //son varios middle  a ocupar
        //estos campos no pueden estar vacios
        check("nombre", "nombre obligatorio").not().isEmpty(),
        check("password", "password obligatorio").not().isEmpty(),
        check("email", "email obligatorio").isEmail(),
        validarCampos,
    ],
    crearUsuario
);

//actualizar usuario
router.put(
    "/:id", [
        validarJWT,
        // varlidarADMIN_ROLE_o_MismoUsuario,
        check("nombre", "nombre obligatorio").not().isEmpty(),
        check("email", "email obligatorio").isEmail(),
        check("role", " El role es obligatorio ").not().isEmpty(),
        validarCampos,
    ],
    actualizarUsuario
);
//borrar
router.delete("/:id", [validarJWT,
    //  varlidarADMIN_ROLE
], borrarUsuario)



module.exports = router;