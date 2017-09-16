const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Guest = new Schema({
    firstName: String,
    lastName: String,
    attending: Boolean,
    allowPlusOne: Boolean,
    plusOneFor: {
        type: Schema.ObjectId,
        ref: 'Guest'
    },
    prevFirstName: String,
    prevLastName: String
});

module.exports = mongoose.model('Guest', Guest);