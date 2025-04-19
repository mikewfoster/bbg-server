const db = require('@root/models');
const Sequelize = require('sequelize');
const dtfns = require('date-fns');
const rewardService = require('@controllers/rewards/reward.service');

module.exports = {
    Get,
    GetByName,
    GetTotalPoints,
    GetPointsHistory,
    GetAll,
    create,
    update
};

async function Get(id) {
    var payload; 

    await db.Points.findOne({ raw: true, where: { id: id } })
        .then((currPoint) => {
            const { createdAt, create_id, ...cleanPoint } = currPoint

            if (cleanPoint.updatedAt) {
                var updatedAt = new Date(cleanPoint.updatedAt);
                    updatedAt = dtfns.format(updatedAt, 'MMM. d, yyyy')

                cleanPoint.updatedAt = updatedAt        
            }
            
            payload = cleanPoint;
        })
        .catch((err) => {
            throw Error('Could not find point record. Please try again.');
        });
    
    return payload;
}

async function GetByName(name) {
    var payload; 

    await db.Points.findOne({ raw: true, where: { title: name } })
        .then((currPoint) => {
            const { createdAt, create_id, ...cleanPoint } = currPoint

            if (cleanPoint.updatedAt) {
                var updatedAt = new Date(cleanPoint.updatedAt);
                    updatedAt = dtfns.format(updatedAt, 'MMM. d, yyyy')

                cleanPoint.updatedAt = updatedAt        
            }
            
            payload = cleanPoint;
        })
        .catch((err) => {
            throw Error('Could not find point record. Please try again.');
        });
    
    return payload;
}

async function GetTotalPoints(UserId) {
    var payload;

    await db.UsersPoints.findAll({ 
            raw: true, 
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Points')), 'pointsTotal']
            ],
            where: { UserId: UserId } 
        })
        .then((allPoints) => {
            payload = allPoints[0].pointsTotal || 0;
        })
        .catch((err) => {
            throw Error('Could not find points records. Please try again.');
        });
    
    return payload;
}

async function GetPointsHistory(UserId) {
    var payload = [];

    var userPoints = []

    await db.UsersPoints.findAll({ 
            raw: true, 
            where: { UserId: UserId } ,
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        .then((allPoints) => {
            userPoints = allPoints;            
        })
        .catch((err) => {
            throw Error('Could not find points records. Please try again.');
        });

    for (const p of userPoints) {
        var point = await omitPointsHistoryDetails(p);

        let finalPoint = {}

        if (point.RewardId && !point.PointId) {
            await rewardService.Get(point.RewardId).then((data) => {
                finalPoint.id = point.id;
                finalPoint.type = 'reward';
                finalPoint.title = data.title;
                finalPoint.description = data.description;
                finalPoint.points = point.Points;
                finalPoint.created = point.createdAt;
                
                payload.push(finalPoint);
            });
        }
        
        if (point.PointId && !point.RewardId) {
            await Get(point.PointId).then((data) => {
                finalPoint.id = point.id;
                finalPoint.type = 'point';
                finalPoint.title = data.title;
                finalPoint.description = data.description;
                finalPoint.points = point.Points;
                finalPoint.created = point.createdAt;

                payload.push(finalPoint);
            });
        }
    }
        
    return payload;
}

async function GetAll() {
    var payload = [];

    await db.Points.findAll({ 
        raw: true,
        order: [
            ['createdAt', 'DESC'],
        ], }
    )
        .then((allPoints) => {
            points = allPoints

            Object.keys(points).forEach((p) => {
                var point = omitPointsDetails(points[p]);
                payload.push(point);
            });
        })
        .catch((err) => {
            throw Error('Could not find points records. Please try again.');
        });
    
    return payload;
}

async function create(params) {
    var retVal;
    
    var point = {
        title:          params.title,
        description:    params.description || '', // User
        value:          params.value,
        create_id:      params.username,
        mod_id:         params.username,
        concurrency_ts: new Date(),   
    }

    // save user
    await db.Points.create(point)
        .then((newPoint) => {
            if (newPoint.id) {
                const {updatedAt, mod_id, ...cleanPoint } = newPoint.dataValues

                if (cleanPoint.createdAt) {
                    var createdAt = new Date(cleanPoint.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanPoint.createdAt = createdAt        
                }
                
                retVal = cleanPoint;
            }
        })
        .catch((err) => {
            throw Error('Could not create point record. Please try again.');
        });

    
    return retVal;
}

async function update(UserId, params) {    
    const foundPoint = await db.Points.findOne({ where: { id: params.id } });

    var retVal;

    if (!foundPoint) {
        throw Error(`Point not found. id: ${params.id}`);
    }

    foundPoint.title            = params.title || foundPoint.title;
    foundPoint.description      = params.description || foundPoint.description;
    foundPoint.value            = params.value || foundPoint.value;
    foundPoint.mod_id           = params.username;
    foundPoint.concurrency_ts    = new Date();

    await foundPoint.save({raw: true})
        .then((updatedPoint) => {
            if (updatedPoint.id) {
                const {updatedAt, mod_id, ...cleanPoint } = updatedPoint.dataValues

                if (cleanPoint.createdAt) {
                    var createdAt = new Date(cleanPoint.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanPoint.createdAt = createdAt        
                }
                
                retVal = cleanPoint;
            }
        })
        .catch((err) => {
            throw Error('Could not update point record. Please try again.');
        });
        
    return retVal
}

function omitPointsDetails(point) {
    const { mod_id, updatedAt, concurrency_ts, ...cleanPoint } = point;

    if (cleanPoint.createdAt) {
        var createdAt = new Date(cleanPoint.createdAt);
            createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

        cleanPoint.createdAt = createdAt        
    }

    return cleanPoint;
}

async function omitPointsHistoryDetails(point) {
    const { mod_id, updatedAt, concurrency_ts, UserId, ...cleanPoint } = point;

    if (cleanPoint.createdAt) {
        var createdAt = new Date(cleanPoint.createdAt);
            createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

        cleanPoint.createdAt = createdAt        
    }   

    return cleanPoint;
}