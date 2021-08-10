const { Schema, model } = require('mongoose');


const carShema = Schema({
    brand: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true,
        emun: ['Camiones', 'Carro de coleccion', "Carros", "Maquinaria pesada", "Nautica"]
    },
    year: {
        type: Number,
        require: true
    },
    kilometres: {
        type: Number,
        require: true
    },
    color: {
        type: String,
        require: true
    },
    additionalComments: {
        type: String,
        require: true
    },
    img: {
        type: String,
    },
    user: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
})

carShema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('Car', carShema);