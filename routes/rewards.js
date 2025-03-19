const express = require('express');
const router = express.Router();

const reward = require('@controllers/rewards/reward.controller');
const access = require('@middleware/access');
const authorize = require('@middleware/authorize');

// PUBLIC

// PRIVATE
router.get('/', authorize.isLoggedIn, access.isBabyorAdmin, reward.getAllRewards);
router.get('/:id', authorize.isLoggedIn, access.isBabyorAdmin, reward.getReward);
router.post('/', authorize.isLoggedIn, access.isBabyorAdmin, reward.createSchema, reward.create);
router.patch('/:id', authorize.isLoggedIn, access.isBabyorAdmin, reward.updateSchema, reward.update);

module.exports = router;