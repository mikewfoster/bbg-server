const db = require('@root/models');
const Sequelize = require('sequelize');
const dtfns = require('date-fns');
const rewardService = require('@controllers/rewards/reward.service');
const pointService = require('@controllers/points/point.service');
const userService = require('@controllers/users/user.service');


module.exports = {
    Get,
    GetAll,
    create,
    accept,
    update
};

async function Get(id) {
    let task = {}

    await db.Tasks.findOne({ raw: true, where: { id: id } })
        .then((currTask) => {
            if (currTask.updatedAt) {
                var updatedAt = new Date(currTask.updatedAt);
                    updatedAt = dtfns.format(updatedAt, 'MMM. d, yyyy')

                currTask.updatedAt = updatedAt        
            }

            if (currTask.createdAt) {
                var createdAt = new Date(currTask.createdAt);
                    createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                currTask.createdAt = createdAt        
            }

            if (currTask.completed) {
                var completed = new Date(currTask.completed);
                    completed = dtfns.format(completed, 'MMM. d, yyyy')

                currTask.completed = completed        
            }
            
            task = currTask;
        })
        .catch((err) => {
            throw Error('Could not find task record. Please try again.');
        });

    if (task.reward_id && !task.point_id) {
        await rewardService.Get(task.reward_id)
            .then((data) => {       
                task.item = data
            })
            .catch((err) => {
                throw Error('Could not find reward record. Please try again.');
            });
    }

    if (task.point_id && !task.reward_id) {
        await pointService.Get(task.point_id)
            .then((data) => {       
                task.item = data 
            })
            .catch((err) => {
                throw Error('Could not find point record. Please try again.');
            });
    }
    
    return task;
}

async function GetAll() {  
    var payload = [];
    var tasks = []

    await db.Tasks.findAll({ 
        raw: true,        
        order: [
            ['createdAt', 'DESC'],
        ],
     })
        .then((allTasks) => {
            tasks = allTasks
        })
        .catch((err) => {
            throw Error('Could not find tasks records. Please try again.');
        });

    for (const t of tasks) {
        var task = await omitTasksDetails(t);

        await Get(task.id).then((data) => {
            payload.push(data);
        })
    }
    
    return payload;
}

async function create(params) {
    var retVal;

    var task = {
        user_id:        params.user_id,
        note:           params.note || null,
        reward_id:      params.reward_id || null,
        point_id:       params.point_id || null,
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

async function accept(params) {    
    const foundTask = await db.Tasks.findOne({ where: { id: params.id } });

    var retVal;
    var taskDetails = {}

    if (!foundTask) {
        throw Error(`Task not found. id: ${params.id}`);
    }

    await Get(foundTask.id).then((data) => {
        taskDetails = data
    })

    const userPoints = {
        point_id:       taskDetails.point_id,
        reward_id:      taskDetails.reward_id,
        username:       params.username,
        user_id:        taskDetails.user_id
    }

    await userService.updatePoints(userPoints)
        .then((data) => {
            retVal = data;
        })
        .catch((err) => {
            throw Error('Could not accept task. Please try again.');
        });

    foundTask.completed        = new Date();
    foundTask.mod_id           = params.username;
    foundTask.concurrency_ts   = new Date();

    await foundTask.save({raw: true})
        .then((updatedTask) => {
            console.log('updatedTask', updatedTask);
            
        })
        .catch((err) => {
            throw Error('Could not complete task. Please try again.');
        });
        
    return retVal
}

async function update(params) {    
    const foundTask = await db.Tasks.findOne({ where: { id: params.id } });

    var retVal;

    if (!foundTask) {
        throw Error(`Task not found. id: ${params.id}`);
    }

    foundTask.note             = params.note || foundTask.note;
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
            throw Error('Could not update task record. Please try again.');
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

    if (cleanTask.completed) {
        var completed = new Date(cleanTask.completed);
            completed = dtfns.format(completed, 'MMM. d, yyyy')

        cleanTask.completed = completed        
    }

    return cleanTask;
}