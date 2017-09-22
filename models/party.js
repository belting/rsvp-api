const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Party = new Schema({
    responseType: String,
    responseAt: Date,
    responseNote: String,
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
}, {
    timestamps: true
});

class PartyClass {
    toPublic() {
        const {
            _id,
            guests
        } = this;

        return {
            _id,
            guests: guests.map(g => g.toPublic())
        }
    }
}

Party.loadClass(PartyClass);
module.exports = mongoose.model('Party', Party);