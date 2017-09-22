const express = require('express');
const router = express.Router();

const Guest = require('../models/guest');
const Party = require('../models/party');
const ResponseType = require('../enums/response-type');
const secured = require('../auth/secured');
const { isAuthenticated } = require('../auth/helpers');

router.get('/', (req, res, next) => {
    const { guestId } = req.query;

    if (guestId) {
        return Party.findOne({
            guests: {
                $in: [
                    guestId
                ]
            }
        })
            .populate('guests')
            .then(party => {
                if (party.responseType !== ResponseType.NONE) {
                    return res.status(409).send(`Party id ${party._id} has already RSVPed`);
                }
                res.json(party.toPublic())
            })
            .catch(next);
    }

    if (!isAuthenticated(req)) {
        return res.status(401).send('Unauthorized');
    }

    return Party.find()
        .populate('guests')
        .then(parties => res.json(parties))
        .catch(next);
});

router.get('/:partyId', secured, (req, res, next) => {
    const { partyId } = req.params;

    return Party.findById(partyId)
        .populate('guests')
        .then(party => res.json(party))
        .catch(next);
});

router.post('/:partyId/rsvp', (req, res, next) => {
    const { partyId } = req.params;
    const { responseNote, responseType, guests } = req.body;

    return Party.findById(partyId)
        .populate('guests')
        .then(party => {
            if (party.responseType !== ResponseType.NONE) {
                return res.status(409).send(`Party id ${partyId} has already RSVPed`);
            }

            guests.forEach(guest => {
                const {
                    _id,
                    attending,
                    plusOneFor
                } = guest;

                let {
                    firstName,
                    lastName
                } = guest;

                firstName = firstName.trim();
                lastName = lastName.trim();

                if (_id) {
                    const matchingGuest = party.guests.find(g => g._id.equals(_id));

                    if (!matchingGuest) {
                        return next(new Error(`Guest id ${_id} does not exist in party id ${partyId}`));
                    }

                    if (matchingGuest.firstName !== firstName) {
                        matchingGuest.prevFirstName = matchingGuest.firstName;
                        matchingGuest.firstName = firstName;
                    }

                    if (matchingGuest.lastName !== lastName) {
                        matchingGuest.prevLastName = matchingGuest.lastName;
                        matchingGuest.lastName = lastName;
                    }

                    matchingGuest.attending = attending;
                } else if (plusOneFor) {
                    const validPlusOne = party.guests.find(g => g.allowPlusOne && g._id.equals(plusOneFor)) && !party.guests.includes(g => g.plusOneFor.equals(plusOneFor));

                    if (!validPlusOne) {
                        return next(new Error(`Guest id ${_id} is not allowed a plus one or does not exist in party id ${partyId}`));
                    }

                    party.guests.push(new Guest({
                        firstName,
                        lastName,
                        attending,
                        plusOneFor,
                        allowPlusOne: false
                    }));
                }
            });

            const updateGuests = party.guests.map(g => g.save());

            return Promise.all(updateGuests).then(updatedGuests => {
                party.responseAt = Date.now();
                party.responseType = responseType || ResponseType.ONLINE;
                party.responseNote = responseNote;
                party.guests = updatedGuests;
                return party.save()
                    .then(() => res.status(200).send());
            });
        })
        .catch(next);
});

module.exports = router;
