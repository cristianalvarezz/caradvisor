/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    addfriend,
    deletefriend
} = require("../controllers/users");
//I import the validation package
const { check } = require("express-validator");
const router = Router();
//I import validations
const { validateFields } = require("../middlewares/validate-fields");
const { validatefriend } = require("../middlewares/validate-friend")
    //validate token
const {
    validateJWT,
    varlidateADMIN_ROLE,
    varlidateADMIN_ROLE_or_sameUser
} = require("../middlewares/validate-jwt");

//get users
router.get("/", validateJWT, getUsers);
// create user
// the middleware are functions that will always be executed   
router.post(
    "/", [
        // there are several middle to occupy
        // these fields cannot be empty
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
        varlidateADMIN_ROLE_or_sameUser,
        check("name", "mandatory name").not().isEmpty(),
        check("phone", "mandatory name").not().isEmpty(),
        check("email", "mandatory email obligatorio").isEmail(),
        validateFields,
    ],
    updateUser
);
//agregar amigo
router.post(
    "/addfriend/:id", [
        validatefriend
    ],
    addfriend
);
//eliminar amigo
router.put(
    "/deletefriend/:id", [validatefriend],
    deletefriend
);
//borrar
router.delete(
    "/:id", [validateJWT, varlidateADMIN_ROLE, ],
    deleteUser
);

module.exports = router;