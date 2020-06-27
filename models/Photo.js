const {Schema, model} = require('mongoose');

const Photo = new Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    owner_id: {
        type: String,
        required: true
    }
},  {versionKey: '_somethingElse' });

module.exports = model('Photo', Photo);