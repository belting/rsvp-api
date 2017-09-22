const Role = require('../enums/role');


const isAuthenticated = req => req.user && req.user.role === Role.ADMIN;

module.exports = {
    isAuthenticated
};