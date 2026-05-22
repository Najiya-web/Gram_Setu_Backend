const express = require('express');
const registerController = require('../controllers/Register');

const route = express.Router();

route.post('/register', registerController);

module.exports = route;