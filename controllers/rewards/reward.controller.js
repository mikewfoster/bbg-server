const Joi = require('joi');
const rewardService = require('@controllers/rewards/reward.service');

const e = require('@util/errors');
const v = require('@util/validation');

const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

exports.create = function(req, res) {    
    rewardService.create(req.body)
        .then((data) => {       
            res.json({
                success: true,
                title: 'Reward created successfully.',
                reward: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not create a reward.', err.message)
            res.json(error);
        });
}

exports.update = function(req, res, next) {
    const id = req.body.id;

    const reward = {
        title:          req.body.title,
        description:    req.body.description,
        link:           req.body.link,
        value:          req.body.value,
        username:       req.body.username,
        id:             req.params.id
    }

    rewardService.update(id, reward)
        .then((data) => {
            req.reward = data;
            res.json({
                success: true,
                title: 'Reward updated successfully.',
                reward: data
            });
        })
        .catch((err) => {
            const error = e.setError('Could not update reward.', err.message)
            res.json(error);
        });
}


exports.getReward = function(req, res) {    
    rewardService.Get(req.params.id)
        .then((reward) => {       
            res.json({
                success: true,
                title: 'Reward retrieved.',
                reward: reward
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find reward.', err.message)
            res.json(error);
        });
}

exports.getAllRewards = function(req, res) {    
    rewardService.GetAll()
        .then((rewards) => {       
            res.json({
                success: true,
                title: 'Reward retrieved.',
                rewards: rewards
            });
        })
        .catch((err) => {
            const error = e.setError('Could not find rewards.', err.message)
            res.json(error);
        });
}

// Schemas
exports.createSchema = function(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required().max(100).allow(null, ''), 
        description: Joi.string().max(255).allow(null, ''), 
        link: Joi.string().max(255).allow(null, ''), 
        value: Joi.number().required(),
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}

exports.updateSchema = function(req, res, next) {
    const schema = Joi.object({
        title: Joi.string().required().max(100).allow(null, ''), 
        description: Joi.string().max(255).allow(null, ''), 
        link: Joi.string().max(255).allow(null, ''), 
        value: Joi.number().required(),
        id: Joi.number().required(),
        username: Joi.string().required().min(6).max(30).regex(/(^[a-zA-Z0-9_]*$)/)
    });
    
    v.validateSchema(schema, options, req, res, next);
}