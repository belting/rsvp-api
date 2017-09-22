const { BasicStrategy } = require('passport-http');
const Role = require('../enums/role');

module.exports = new BasicStrategy(
    (username, password, done) => {
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            return done(null, {
                role: Role.ADMIN
            });
        }
        return done(null, false);
    }
);