const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Party = new Schema({
    responseType: String,
    responseAt: Date,
    name: String,
    addressTo: String,
    addressLineOne: String,
    addressLineTwo: String,
    city: String,
    state: String,
    zip: String,
    guests: [{
        type: Schema.ObjectId,
        ref: 'Guest'
    }]
});

module.exports = mongoose.model('Party', Party);