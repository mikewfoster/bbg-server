const express = require('express');
const router = express.Router();

const user = require('@controllers/users/user.controller');
const authorize = require('@middleware/authorize');
const access = require('@middleware/access');

// PUBLIC
router.post('/', user.createSchema, user.create);

// PRIVATE
router.get('/', authorize.isLoggedIn, access.isAdmin, user.getProfiles);
router.get('/:id', authorize.isLoggedIn, access.isSelforAdmin, user.getProfile);
router.get('/:id/points', authorize.isLoggedIn, access.isSelforAdmin, user.getPoints);

router.post('/:id/points', authorize.isLoggedIn, access.isAdmin, user.updatePointsSchema, user.updatePoints );
router.post('/:id/points/game', authorize.isLoggedIn, access.isSelforAdmin, user.completeGameSchema, user.completeGame );

router.patch('/:id', authorize.isLoggedIn, access.isSelforAdmin, user.updateSchema, user.update, user.getProfile);
router.patch('/:id/role', authorize.isLoggedIn, access.isAdmin, user.updateRoleSchema, user.updateRole, user.getProfile);

module.exports = router;