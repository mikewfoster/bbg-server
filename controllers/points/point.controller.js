const Joi = require('joi');
const pointService = require('@controllers/points/point.service');
const e = require('@util/errors');
const v = require('@util/validation');

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

exports.create = function(req, res) {    
    pointService.create(req.body)
        .then((data) => {       
            res.json({
                success: true,
                title: 'Point created successfully.',
                point: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not create a point.', err.message)
            res.json(error);
        });
}

exports.update = function(req, res, next) {
    const id = req.body.id;

    const point = {
        title:          req.body.email,
        description:    req.body.description,
        value:          req.body.value,
        username:       req.body.username,
        id:             req.params.id
    }

    pointService.update(id, point)
        .then((data) => {
            req.point = data;
            res.json({
                success: true,
                title: 'Point updated successfully.',
                point: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not update point.', err.message)
            res.json(error);
        });
}

exports.getPoint = function(req, res) {    
    pointService.Get(req.params.id)
        .then((point) => {       
            res.json({
                success: true,
                title: 'Point retrieved.',
                point: point
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find point.', err.message)
            res.json(error);
        });
}

exports.getAllPoints = function(req, res) {    
    pointService.GetAll()
        .then((points) => {       
            res.json({
                success: true,
                title: 'Point retrieved.',
                points: points
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find points.', err.message)
            res.json(error);
        });
}

// Schemas
exports.createSchema = function(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required().max(100).allow(null, ''), 
        description: Joi.string().max(255).allow(null, ''), 
        value: Joi.number().required(),
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}

exports.updateSchema = function(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required().max(100).allow(null, ''), 
        description: Joi.string().max(255).allow(null, ''), 
        value: Joi.number().required(),
        id: Joi.number().required(),
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}