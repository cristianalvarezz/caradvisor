const express = require('express');
const { dbConnection } = require('./database/config')
    //Enviroment variables
require('dotenv').config();

const cors = require('cors');

const app = express();


//the use is a function to be executed always for all the lines that go down
app.use(cors());

//Lectura y parseo del body 
app.use(express.json())

//Base de datos
dbConnection();

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo el puerto ' + process.env.PORT)
})