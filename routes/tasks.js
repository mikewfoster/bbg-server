const express = require('express');
const router = express.Router();

const task = require('@controllers/tasks/task.controller');
const access = require('@middleware/access');
const authorize = require('@middleware/authorize');

// PUBLIC

// PRIVATE
router.get('/', authorize.isLoggedIn, access.isBabyorAdmin, task.getAllTasks);
router.get('/:id', authorize.isLoggedIn, access.isBabyorAdmin, task.getTask);
router.post('/', authorize.isLoggedIn, access.isBabyorAdmin, task.createSchema, task.create);
router.patch('/:id', authorize.isLoggedIn, access.isSelforAdmin, task.updateSchema, task.update);

module.exports = router;