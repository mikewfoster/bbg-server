const express = require('express');
const router = express.Router();

const point = require('@controllers/points/point.controller');
const access = require('@middleware/access');
const authorize = require('@middleware/authorize');

// PUBLIC

// PRIVATE
router.get('/', authorize.isLoggedIn, access.isBabyorAdmin, point.getAllPoints);
router.get('/:id', authorize.isLoggedIn, access.isBabyorAdmin, point.getPoint);
router.post('/', authorize.isLoggedIn, access.isBabyorAdmin, point.createSchema, point.create);
router.patch('/:id', authorize.isLoggedIn, access.isSelforAdmin, point.updateSchema, point.update);

module.exports = router;