const {Schema, model} = require('mongoose');

const User = new Schema({
    password: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        default: '-1',
    }
}, { versionKey: '_somethingElse' });


module.exports = model('User', User);