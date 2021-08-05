/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/users");
//importo el paquete  de validaciones
const { check } = require("express-validator");
const router = Router();
//importo validaciones
const { validateFields } = require("../middlewares/validate-fields");
//calidar token
const {
    validateJWT,
    varlidarADMIN_ROLE,
    varlidarADMIN_ROLE_o_MismoUsuario
} = require("../middlewares/validate-jwt");

//obtener usuarios
router.get(
    "/",
    validateJWT,
    getUsers
);
//crear usuario
//el middleware son funciones que siempre se van a ejecutar
router.post(
    "/", [
        //son varios middle  a ocupar
        //estos campos no pueden estar vacios
        check("name", "mandatory name").not().isEmpty(),
        check("phone", "mandatory name").not().isEmpty(),
        check("password", "mandatory password").not().isEmpty(),
        check("email", "mandatory email obligatorio").isEmail(),
        validateFields,
    ],
    createUser
);

//actualizar usuario
router.put(
    "/:id", [
        validateJWT,
        // varlidarADMIN_ROLE_o_MismoUsuario,
        check("name", "mandatory name").not().isEmpty(),
        check("phone", "mandatory name").not().isEmpty(),
        check("email", "mandatory email obligatorio").isEmail(),
        validateFields,
    ],
    updateUser
);
//borrar
router.delete("/:id", [validateJWT,
    //  varlidarADMIN_ROLE
], deleteUser)



module.exports = router;