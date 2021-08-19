const mongoose = require('mongoose');



const dbConnection = async() => {

    try {

        await mongoose.connect('mongodb+srv://christian:MD8io0JIY4EuLkBq@cluster0.k96kk.mongodb.net/socialcar', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }


}



module.exports = {
    dbConnection
}