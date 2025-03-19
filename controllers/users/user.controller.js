const Joi = require('joi');

const userService = require('./user.service');
const loginService = require('@controllers/logins/login.service');
const pointService = require('@controllers/points/point.service');

const e = require('@util/errors');
const v = require('@util/validation');

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

exports.create = function(req, res) {    
    userService.create(req.body)
        .then((username) => {       
            res.json({
                success: true,
                title: 'Registration successful.',
                message: `Your username is "${username}".`
            });
        })
        .catch((err) => {
            const error = e.setError('Could not create an account.', err.message)
            res.json(error);
        });
}

exports.update = function(req, res, next) {
    const id = req.body.id;

    const user = {
        email:      req.body.email,
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        username:   req.body.username,
        id:         req.params.id
    }

    userService.update(id, user)
        .then((data) => {
            req.user = data;
            next();
        })
        .catch((err) => {
            const error = e.setError('Could not update user.', err.message)
            res.json(error);
        });
}

exports.updateRole = function(req, res, next) {
    const id = req.body.id;

    const user = {
        role:       req.body.role,
        username:   req.body.username,
        id:         req.params.id
    }

    userService.updateRole(id, user)
        .then((data) => {
            req.user = data;
            next();
        })
        .catch((err) => {
            const error = e.setError('Could not update user role.', err.message)
            res.json(error);
        });
}

exports.updatePoints = function(req, res, next) {
    const userPoints = {
        point_id:       req.body.PointId,
        reward_id:      req.body.RewardId,
        username:       req.body.username,
        user_id:        req.params.id
    }

    userService.updatePoints(userPoints)
        .then((data) => {
            req.point = data;
            res.json({
                success: true,
                title: 'Points adjusted successfully.',
                point: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not adjust points.', err.message)
            res.json(error);
        });
}

exports.authenticate = function(req, res, next) {
    userService.authenticate(req.body)
        .then((user) => {
            req.user = user;
            next();
        })
        .catch((err) => {
            const error = e.setError('Authentication failed.', err.message)
            res.json(error);
        });
}

exports.getProfile = async function (req, res) {
    let id = null;

    if (req.user.id) id = req.user.id;
    if (req.params.id) id = req.params.id;

    var profile = {
        user: {}
    };

    await loginService.Get(id)
        .then((data) => {
            profile.user.username = data.username;
        })
        .catch((err) => {
            const error = e.setError('Could not find login record.', err.message)
            res.json(error);
        });

    await userService.Get(id)
        .then((data) => {
            profile.user.id = data.id;
            profile.user.email = data.email || '';
            profile.user.first_name = data.first_name || '';
            profile.user.last_name = data.last_name || '';
            profile.user.full_name = (data.first_name && data.last_name) ? data.first_name + ' ' + data.last_name : '';
            profile.user.role = {
                id: data.role.id,
                code: data.role.code,
                title: data.role.title,
                description: data.role.description || '',
            };
        })
        .catch((err) => {
            const error = e.setError('Could not find user.', err.message)
            res.json(error);
        });

    await pointService.GetTotalPoints(id)
        .then((data) => {
            profile.user.points = data;

            res.json({
                success: true,
                token: req.user.token,
                profile: profile
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find points.', err.message)
            res.json(error);
        });
}

exports.getProfiles = async function (req, res) {
    let users = []

    await userService.GetAll()
        .then((data) => {
            users = data;      
        })
        .catch((err) => {
            const error = e.setError('Could not find users.', err.message)
            res.json(error);
        });
    
    for (let u = 0; u < users.length; u++) {
        await loginService.Get(users[u].id)
            .then((data) => {
                users[u].username = data.username;
            })
            .catch((err) => {
                const error = e.setError('Could not find users.', err.message)
                res.json(error);
            }); 
    }
 
    res.json({
        success: true,
        users: users,
    });       
}

exports.getPoints = async function (req, res) {
    let id = null;

    if (req.user.id) id = req.user.id; 
    if (req.params.id) id = req.params.id;

    await pointService.GetPointsHistory(id)
        .then((data) => {
           res.json({
                success: true,
                token: req.user.token,
                points: data
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
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/), 
        password: Joi.string().required().min(10)
    });

    v.validateSchema(schema, options, req, res, next);
}

exports.updateSchema = function(req, res, next) {
    const schema = Joi.object({
        email: Joi.string().email().allow(null, ''),
        first_name: Joi.string().max(100).allow(null, '').messages({
            'string.max': 'Your first name must be less than 100 characters in length.'
        }),
        last_name: Joi.string().max(100).allow(null, '').messages({
            'string.max': 'Your last name must be less than 100 characters in length.'
        }),
        id: Joi.number().required(),
        username: Joi.string().max(30),
    });

    v.validateSchema(schema, options, req, res, next);
}

exports.updateRoleSchema = function(req, res, next) {
    const schema = Joi.object({
        role: Joi.number().min(2).max(3).required(),
        id: Joi.number().required(),
        username: Joi.string().max(30),
    });

    v.validateSchema(schema, options, req, res, next);
}

exports.updatePointsSchema = function(req, res, next) {
    const schema = Joi.object({
        PointId: Joi.number().allow(null, ''), 
        RewardId: Joi.number().allow(null, ''), 
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });

    v.validateSchema(schema, options, req, res, next);
}

exports.authSchema = function(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required().regex(/(^[a-zA-Z0-9_]*$)/).messages({
            'any.empty': 'You must enter a username to log in.',
            'string.empty': 'You must enter a username to log in.'
        }),
        password: Joi.string().required().messages({
            'any.empty': 'You must enter a password to log in.',
            'string.empty': 'You must enter a password to log in.'
        })
    });

    v.validateSchema(schema, options, req, res, next);
}