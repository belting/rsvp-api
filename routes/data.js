const express = require('express');
const router = express.Router();
const csv = require('csvtojson');

const Guest = require('../models/guest');
const Party = require('../models/party');
const ResponseType = require('../enums/response-type');

const IGNORE_ROW = '*';
const PLUS_ONE = '+1';

// Accepts CSV with the following columns:
// name, addressTo, addressLineOne, addressLineTwo, city, state, zip, guests
router.post('/import', (req, res, next) => {
    csv().fromString(req.body)
        .on('csv', row => {
            const [ name, addressTo, addressLineOne, addressLineTwo, city, state, zip, guestsStr ] = row;

            if (name.startsWith(IGNORE_ROW)) {
                return;
            }

            const createGuests = guestsStr.split(',').map(guestName => {
                const [firstName, lastName, allowPlusOne] = guestName.trim().split(/\s+/);

                return Guest.create({
                    firstName: firstName.replace(/_/g, ' '),
                    lastName: lastName.replace(/_/g, ' '),
                    allowPlusOne: allowPlusOne === PLUS_ONE
                });
            });

            return Promise.all(createGuests).then(guests => {
                return Party.create({
                    responseType: ResponseType.NONE,
                    name,
                    addressTo,
                    addressLineOne,
                    addressLineTwo,
                    city,
                    state,
                    zip,
                    guests
                });
            }).catch(next);
        })
        .on('done', () => res.status(201).send())
        .on('error', next);
});

module.exports = router;