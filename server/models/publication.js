const { Schema, model } = require('mongoose');

const PublicationSchema = Schema({
    text: {
        type: String,
        required: true
    },
    file: {
        type: String,
        default: "Esta parte aun no "
    },
    created_at: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});



PublicationSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})
module.exports = model('publication', PublicationSchema);