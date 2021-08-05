const express = require('express');
const { dbConnection } = require('./database/config')
    //variables de entorno
require('dotenv').config();

const cors = require('cors');

const app = express();

//el use es una funcion que se ejecutara siempre para todas las lineas que siguen hacia abajo  
app.use(cors());

//Lectura y parseo del body 
app.use(express.json())

//Base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo el puerto ' + process.env.PORT)
})