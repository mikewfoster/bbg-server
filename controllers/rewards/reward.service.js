const db = require('@root/models');
const Sequelize = require('sequelize');
const dtfns = require('date-fns');


// const { remove } = require('./user.controller');

module.exports = {
    Get,
    GetAll,
    create,
    update
};

async function Get(id) {
    var payload;

    await db.Rewards.findOne({ raw: true, where: { id: id } })
        .then((currReward) => {
            const { createdAt, create_id, ...cleanReward } = currReward

            if (cleanReward.updatedAt) {
                var updatedAt = new Date(cleanReward.updatedAt);
                    updatedAt = dtfns.format(updatedAt, 'MMM. d, yyyy')

                cleanReward.updatedAt = updatedAt        
            }
            
            payload = cleanReward;
        })
        .catch((err) => {
            throw Error('Could not find reward record. Please try again.');
        });
    
    return payload;
}

async function GetAll() {
    var payload = [];

    await db.Rewards.findAll({ raw: true })
        .then((allRewards) => {
            rewards = allRewards

            Object.keys(rewards).forEach((p) => {
                var reward = omitRewardsDetails(rewards[p]);
                payload.push(reward);
            });
        })
        .catch((err) => {
            throw Error('Could not find rewards records. Please try again.');
        });
    
    return payload;
}

async function create(params) {
    var retVal;
    
    var reward = {
        title:          params.title,
        description:    params.description || '', // User
        link:           params.link || '', // User
        value:          params.value,
        create_id:      params.username,
        mod_id:         params.username,
        concurrency_ts: new Date(),   
    }

    // save user
    await db.Rewards.create(reward)
        .then((newReward) => {
            if (newReward.id) {
                const {updatedAt, mod_id, ...cleanReward } = newReward.dataValues

                if (cleanReward.createdAt) {
                    var createdAt = new Date(cleanReward.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanReward.createdAt = createdAt        
                }
                
                retVal = cleanReward;
            }
        })
        .catch((err) => {
            throw Error('Could not create reward record. Please try again.');
        });

    
    return retVal;
}

async function update(UserId, params) {    
    const foundReward = await db.Rewards.findOne({ where: { id: params.id } });

    var retVal;

    if (!foundReward) {
        throw Error(`Reward not found. id: ${params.id}`);
    }

    foundReward.title            = params.title || foundReward.title;
    foundReward.description      = params.description || foundReward.description;
    foundReward.link             = params.link || foundReward.link;
    foundReward.value            = params.value || foundReward.value;
    foundReward.mod_id           = params.username;
    foundReward.concurrency_ts   = new Date();

    await foundReward.save({raw: true})
        .then((updatedReward) => {
            if (updatedReward.id) {
                const {updatedAt, mod_id, ...cleanReward } = updatedReward.dataValues

                if (cleanReward.createdAt) {
                    var createdAt = new Date(cleanReward.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanReward.createdAt = createdAt        
                }
                
                retVal = cleanReward;
            }
        })
        .catch((err) => {
            throw Error('Could not update reward record. Please try again.');
        });
        
    return retVal
}

function omitRewardsDetails(reward) {
    const { mod_id, updatedAt, concurrency_ts, ...cleanReward } = reward;

    if (cleanReward.createdAt) {
        var createdAt = new Date(cleanReward.createdAt);
            createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

        cleanReward.createdAt = createdAt        
    }

    return cleanReward;
}