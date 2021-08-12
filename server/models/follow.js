const { Schema, model } = require('mongoose');

const followSchema = Schema({

    user: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    followed: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});



followSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('follow', followSchema);