const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();

        this.port = process.env.PORT;

        this.app.use(express.json());
        this.paths = {
                user: '/api/user',
                auth: '/api/auth',
                follow: '/api/follow'
            }
            // Conectar a base de datos
        this.conectarDB();
        // Rutas de mi aplicación
        this.routes();

        this.middlewares();

    }

    async conectarDB() {
        await dbConnection();
    }


    routes() {
        this.app.use(this.paths.user, require('../routes/user'));
        this.app.use(this.paths.auth, require('../routes/auth'));

        //follow
        this.app.use(this.paths.follow, require('../routes/follow'))


    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;