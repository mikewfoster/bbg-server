const db = require('@root/models');
const Sequelize = require('sequelize');
const dtfns = require('date-fns');
const rewardService = require('@controllers/rewards/reward.service');


module.exports = {
    Get,
    GetAll,
    create,
    update
};

async function Get(id) {
    var payload; 

    await db.Tasks.findOne({ raw: true, where: { id: id } })
        .then((currTask) => {
            const { createdAt, create_id, ...cleanTask } = currTask

            if (cleanTask.updatedAt) {
                var updatedAt = new Date(cleanTask.updatedAt);
                    updatedAt = dtfns.format(updatedAt, 'MMM. d, yyyy')

                cleanTask.updatedAt = updatedAt        
            }
            
            payload = cleanTask;
        })
        .catch((err) => {
            throw Error('Could not find task record. Please try again.');
        });
    
    return payload;
}

async function GetAll() {
    var payload = [];

    await db.Tasks.findAll({ raw: true })
        .then((allTasks) => {
            tasks = allTasks

            Object.keys(tasks).forEach((p) => {
                var task = omitTasksDetails(tasks[p]);
                payload.push(task);
            });
        })
        .catch((err) => {
            throw Error('Could not find tasks records. Please try again.');
        });
    
    return payload;
}

async function create(params) {
    var retVal;

    var task = {
        user_id:        req.body.user_id,
        note:           req.body.note || null,
        reward_id:      req.body.reward_id || null,
        point_id:       req.body.point_id || null,
        create_id:      params.username,
        mod_id:         params.username,
        concurrency_ts: new Date(),   
    }

    // save user
    await db.Tasks.create(task)
        .then((newTask) => {
            if (newTask.id) {
                const {updatedAt, mod_id, ...cleanTask } = newTask.dataValues

                if (cleanTask.createdAt) {
                    var createdAt = new Date(cleanTask.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanTask.createdAt = createdAt        
                }
                
                retVal = cleanTask;
            }
        })
        .catch((err) => {
            throw Error('Could not create task record. Please try again.');
        });

    
    return retVal;
}

async function update(UserId, params) {    
    const foundTask = await db.Tasks.findOne({ where: { id: params.id } });

    var retVal;

    if (!foundTask) {
        throw Error(`Task not found. id: ${params.id}`);
    }

    foundTask.note             = params.note || foundTask.note;
    foundTask.user_id          = params.user_id || foundTask.user_id;
    foundTask.reward_id        = params.reward_id || foundTask.reward_id;
    foundTask.point_id         = params.point_id || foundTask.point_id;
    foundTask.mod_id           = params.username;
    foundTask.concurrency_ts   = new Date();

    await foundTask.save({raw: true})
        .then((updatedTask) => {
            if (updatedTask.id) {
                const {updatedAt, mod_id, ...cleanTask } = updatedTask.dataValues

                if (cleanTask.createdAt) {
                    var createdAt = new Date(cleanTask.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanTask.createdAt = createdAt        
                }
                
                retVal = cleanTask;
            }
        })
        .catch((err) => {
            throw Error('Could not create task record. Please try again.');
        });
        
    return retVal
}

function omitTasksDetails(task) {
    const { mod_id, updatedAt, concurrency_ts, ...cleanTask } = task;

    if (cleanTask.createdAt) {
        var createdAt = new Date(cleanTask.createdAt);
            createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

        cleanTask.createdAt = createdAt        
    }

    return cleanTask;
}