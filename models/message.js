const { Schema, model } = require('mongoose');

const MessageSchema = Schema({

    text: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: String,
        required: true,
    },
    emitter: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    receiver: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User',
    }

});



MessageSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})




module.exports = model('Message', MessageSchema);