const mongoose = require("mongoose");
require('dotenv').config();
//funcion encargada de hacer la conexion
const dbConnection = async() => {

    try {

        //esta funcion retorna una promesa
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('Base de datos Online')
    } catch (error) {
        console.log(error)
        throw new Error('Error a la hora de levantar la base de datos ')
    }

};

module.exports = {
    //estoy exportando la base de datos
    dbConnection
}