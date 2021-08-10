const express = require('express');
const { dbConnection } = require('./database/config')
    //Enviroment variables
require('dotenv').config();

const cors = require('cors');

const app = express();


app.use(cors());


app.use(express.json())


dbConnection();


app.use('/api/users', require('./routes/users'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo el puerto ' + process.env.PORT)
})