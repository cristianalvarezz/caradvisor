const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");

const { home, saveUser, updateUser, userDelete, getUsers, getUser } = require("../controllers/user");

const { validarCampos, esAdminRole, tieneRole } = require("../middlewares/validar-campos");
const { validateJWT } = require("../middlewares/validate-jwt")
const { esRoleValido, emailExiste, existeUsuarioPorId, nickExiste } = require("../helpers/db-validators");

router.get(
    "/", [check("name", "El nombre es obligatorio").not().isEmpty()],
    home
);

router.post(
    "/register", [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("password", "El password debe de ser más de 6 letras").isLength({
            min: 6,
        }),
        check("surname", "El surname es obligatorio").not().isEmpty(),
        check("nick", "El nick es obligatorio").not().isEmpty(),
        check("nick").custom(nickExiste),
        check("phone", "El phone es obligatorio").not().isEmpty(),
        check("email", "El correo no es válido").isEmail(),
        check("email").custom(emailExiste),
        validarCampos,
    ],
    saveUser
);

router.put(
    "/:id", [
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeUsuarioPorId),
        check("rol").custom(esRoleValido),
        validarCampos,
    ],
    updateUser
);

router.delete('/:id', [
        validateJWT,
        esAdminRole,
        check('id', 'No es un ID válido').isMongoId(),
        check('id').custom(existeUsuarioPorId),
        validarCampos
    ],
    userDelete);

router.get('/a/:page?', validateJWT, getUsers);


router.get('/b/:id', validateJWT, getUser);

module.exports = router;