const express = require('express');
const { dbConnection } = require('../database/config');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();

        this.port = process.env.PORT || 8080;
        this.app.use(cors());

        this.app.use(express.json());
        this.paths = {
                user: '/api/user',
                auth: '/api/auth',
                follow: '/api/follow',
                message: '/api/message',
                publication: '/api/publication',
                search: '/api/search'
            }
            // Conectar a base de datos
        try {
            this.conectarDB();
        } catch (error) {
            console.log(error);
            throw new Error('Error a la hora de iniciar la base de datos');
        }
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

        //mesagge 
        this.app.use(this.paths.message, require('../routes/message'))


        //publication 
        this.app.use(this.paths.publication, require('../routes/publication'))

        //search 
        this.app.use(this.paths.search, require('../routes/search'))

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