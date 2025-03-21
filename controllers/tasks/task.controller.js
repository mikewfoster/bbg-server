const Joi = require('joi');
const taskService = require('@controllers/tasks/task.service');

const e = require('@util/errors');
const v = require('@util/validation');

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

exports.create = function(req, res) {    
    console.log('Creating task');
    
    taskService.create(req.body)
        .then((data) => {   
            console.log('data', data);    
            res.json({
                success: true,
                title: 'Task created successfully.',
                task: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not create a task.', err.message)
            res.json(error);
        });
}

exports.accept = function(req, res, next) {    
    console.log('Accepting task');
    const task = {
        user_id:        req.body.user_id,
        username:       req.body.username,
        id:             req.params.id
    }

    taskService.accept(task)
        .then((data) => {   
            console.log('data', data);    
            res.json({
                success: true,
                title: 'Task accepted successfully.',
                task: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not accept task.', err.message)
            res.json(error);
        });
}

exports.update = function(req, res, next) {
    const task = {
        user_id:        req.body.user_id,
        username:       req.body.username,
        id:             req.params.id,
        note:           req.body.note
    }

    taskService.update(task)
        .then((data) => {
            req.task = data;
            res.json({
                success: true,
                title: 'Task updated successfully.',
                task: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not update task.', err.message)
            res.json(error);
        });
}

exports.getTask = function(req, res) {  
    taskService.Get(req.params.id)
        .then((task) => {       
            res.json({
                success: true,
                title: 'Task retrieved.',
                task: task
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find task.', err.message)
            res.json(error);
        });
}

exports.getAllTasks = function(req, res) {    
    taskService.GetAll()
        .then((tasks) => {       
            res.json({
                success: true,
                title: 'Task retrieved.',
                tasks: tasks
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find tasks.', err.message)
            res.json(error);
        });
}

// Schemas
exports.createSchema = function(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        note: Joi.string().max(255).allow(null, ''), 
        reward_id: Joi.number().allow(null, ''), 
        point_id: Joi.number().allow(null, ''), 
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}
exports.acceptSchema = function(req, res, next) {
    const schema = Joi.object({
        user_id: Joi.number().required(),
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}

exports.updateSchema = function(req, res, next) {
    const schema = Joi.object({
        id: Joi.number().required(),
        user_id: Joi.number().required(),
        note: Joi.string().max(255).allow(null, ''), 
        reward_id: Joi.number().allow(null, ''), 
        point_id: Joi.number().allow(null, ''), 
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}