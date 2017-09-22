const { isAuthenticated } = require('./helpers');

module.exports = (req, res, next) => {
    if (!isAuthenticated(req)) {
        return res.status(401).send('Unauthorized');
    }

    next();
};