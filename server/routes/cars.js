/*
    Ruta: /api/usuarios
*/
const { Router } = require("express");

const { check } = require("express-validator");
const router = Router();

const {
    validateJWT,
} = require("../middlewares/validate-jwt");

const {
    createCar,
    getCars
} = require("../controllers/cars")

router.get("/", [], getCars);
router.post(
    "/", [
        // there are several middle to occupy
        // these fields cannot be empty
        // check("name", "mandatory name").not().isEmpty(),
        // check("phone", "mandatory name").not().isEmpty(),
        // check("password", "mandatory password").not().isEmpty(),
        // check("email", "mandatory email obligatorio").isEmail(),
        // validateFields,
    ],
    createCar
);

module.exports = router;