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
}, {
    timestamps: true
});

class GuestClass {
    toPublic() {
        const {
            _id,
            firstName,
            lastName,
            allowPlusOne
        } = this;

        return {
            _id,
            firstName,
            lastName,
            allowPlusOne
        };
    }
}

Guest.loadClass(GuestClass);
module.exports = mongoose.model('Guest', Guest);