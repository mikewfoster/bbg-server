const express = require('express');
const router = express.Router();

const user = require('@controllers/users/user.controller');
const authorize = require('@middleware/authorize');

// PUBLIC
router.post('/', user.authSchema, user.authenticate, authorize.isLoggedIn, user.getProfile);

module.exports = router;