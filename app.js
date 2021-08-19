require('dotenv').config();
const Server = require('./models/server');


const server = new Server();

server.listen();
server.conectarDB();

if (window.console) {
    console.log("Ejemplo de mensaje o log predeterminado");
    console.error("Ejemplo de mensaje de error");
    console.warn("Ejemplo de mensaje de advertencia");
    console.info("Ejemplo de mensaje de información");
}