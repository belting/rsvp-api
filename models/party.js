const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Party = new Schema({
    responseType: String,
    responseAt: Date,
    guests: [{
        type: Schema.ObjectId,
        ref: 'Guest'
    }]
});

module.exports = mongoose.model('Party', Party);