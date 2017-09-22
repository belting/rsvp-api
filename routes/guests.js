const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../auth/helpers');
const Guest = require('../models/guest');

router.get('/', (req, res, next) => {
    const { firstName, lastName } = req.query;

    if (firstName && lastName) {
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
            .then(guests => res.json(guests.map(g => g.toPublic())))
            .catch(next);
    }

    if (!isAuthenticated(req)) {
        return res.status(401).send('Unauthorized');
    }

    return Guest.find()
        .then(guests => res.json(guests))
        .catch(next);
});

module.exports = router;
