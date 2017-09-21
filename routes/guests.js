const express = require('express');
const router = express.Router();

const Guest = require('../models/guest');

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

module.exports = router;
