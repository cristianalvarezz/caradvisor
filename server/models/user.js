const { Schema, model } = require('mongoose');


const UserSchema = Schema({

    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});


//sobre escribo el metodo 
UserSchema.method('toJSON', function() {

    //del objeto estraido la version y assword y el resto de las propiedades
    //de esta manera no regresare el password
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('User', UserSchema);