const Car = require("../models/car");
const { response } = require("express");


const getCars = async(req, res) => {
    const [cars, total] = await Promise.all([
        Car.find(req.query)
        .populate('user', 'name'),
        Car.countDocuments(req.query),
    ])
    res.json({
        total,
        cars
    });
};

const createCar = async(req, res = response) => {

    try {

        const car = new Car(req.body);
        await car.save();

        res.json({
            ok: true,
            car,

        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: "Unexpected error ",
        });
    }
};

const updateCar = async(req, res = response) => {
    const carId = req.params.id;
    const uid = req.uid;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.json({
                ok: true,
                msg: "carro no encontrado ",
            });
        }
        const cambiosHospital = {
            ...req.body,
            usuario: uid,
        };

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "hable con el administrador",
            //   hospitalActualizado,
        });
    }
}

module.exports = {
    createCar,
    getCars
}