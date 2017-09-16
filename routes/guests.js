const express = require('express');
const router = express.Router();

const Guest = require('../models/guest');
const Party = require('../models/party');
const ResponseType = require('../enums/response-type');

router.get('/', (req, res, next) => {
    const { firstName, lastName } = req.query;

    return Guest.find({
        firstName: {
            $regex: firstName,
            $options: 'i'
        },
        lastName: {
            $regex: lastName,
            $options: 'i'
        }
    }).limit(3)
        .then(guests => res.json(guests))
        .catch(next);
});

// Accepts CSV with the following columns:
// firstName,lastName,partyId,allowPlusOne
router.post('/import', (req, res, next) => {
  const partiesMap = req.body.split('\n').reduce((acc, line) => {
      const [
          firstName,
          lastName,
          partyId,
          allowPlusOne
      ] = line.split(',');

      if (!acc[partyId]) {
          acc[partyId] = [];
      }

      acc[partyId].push(new Guest({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          allowPlusOne: allowPlusOne.trim().toLowerCase() === 'yes'
      }));

      return acc;
  }, {});

  const createParties = Object.keys(partiesMap).map(key => {
      const createGuests = partiesMap[key].map(guest => guest.save());

      return Promise.all(createGuests).then(guests => {
          return Party.create({
              responseType: ResponseType.NONE,
              guests
          });
      });
  });

  return Promise.all(createParties)
      .then(() => res.status(201).send())
      .catch(next);
});

module.exports = router;
