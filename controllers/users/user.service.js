const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('@root/models');
const dtfns = require('date-fns');

module.exports = {
    Get,
    GetAll,
    create,
    update,
    updateRole,
    updatePoints,
    authenticate
};

async function Get(id) {
    var payload;

    await db.Users.findOne({ raw: true, where: { id: id } })
        .then((currUser) => {
            const { create_id, mod_id, concurrency_ts, ...cleanUser } = currUser
            payload = cleanUser;
        })
        .catch((err) => {
            throw Error('Could not find user record. Please try again.');
        });
    
    if (payload.RoleId) {
        await db.Roles.findOne({ raw: true, where: { id: payload.RoleId } })
            .then((currRoll) => {
                const { create_id, createdAt, mod_id, updatedAt, concurrency_ts, ...cleanRole } = currRoll

                payload.role = { 
                    id: cleanRole.id,
                    code: cleanRole.code,
                    title: cleanRole.title,
                    description: cleanRole.description,
                };
            })
            .catch((err) => {
                throw Error('Could not find role record. Please try again.');
            });
    }
    
    return payload;
}

async function GetAll(id) {
    var payload = [];

    var currUsers = []

    await db.Users.findAll({ raw: true })
        .then((result) => {
            currUsers = result;
        })
        .catch((err) => {
            throw Error('Could not find user record. Please try again.');
        });

    for (const u of currUsers) {
        var user = await omitUserDetails(u);
        payload.push(user);
    }
    
    return payload;
}

async function create(params) {
    var p_hash = await bcrypt.hash(params.password, 10);
    
    if (await db.Logins.findOne({ where: { username: params.username } })) {
        throw Error(`Username ${params.username} is already taken.`);
    }
    
    var user = {
        email:          null,
        RoleId:         3, // User
        create_id:      params.username,
        mod_id:         params.username,
        concurrency_ts: new Date(),   
    }

    // save user
    await db.Users.create(user)
        .then((newUser) => {
            if (newUser.id) {
                var login = {
                    UserId:         newUser.id,
                    username:       params.username,
                    p_hash:         p_hash,                    
                    create_id:      params.username,
                    mod_id:         params.username,
                    concurrency_ts: new Date(),
                }

                db.Logins.create(login)
                    .then((newLogin) => {
                    })
                    .catch((err) => {
                        throw Error('Could not create login record. Please try again.');
                    });
            }
        })
        .catch((err) => {
            throw Error('Could not create user record. Please try again.');
        });

    
    const retVal = params.username;
    return retVal;
}

async function update(UserId, params) {    
    const foundUser = await db.Users.findOne({ where: { id: params.id } });
    const emailTaken = await db.Users.findOne({ raw: true, where: { email: params.email } });

    if (!foundUser) {
        throw Error(`User not updated. id: ${UserId}`);
    }

    if (emailTaken && UserId != emailTaken.id) {
        throw Error(`Email ${params.email} is already taken.`);
    }    

    foundUser.email             = params.email || foundUser.email;
    foundUser.last_name         = params.last_name || foundUser.last_name;
    foundUser.first_name        = params.first_name || foundUser.first_name;
    foundUser.mod_id            = params.username; // UserId
    foundUser.concurrency_ts    = new Date();

    const updatedUser = await foundUser.save({raw: true});

    return updatedUser.toJSON();
}

async function updateRole(UserId, params) {    
    const foundUser = await db.Users.findOne({ where: { id: params.id } });

    if (!foundUser) {
        throw Error(`User not updated. id: ${params.id}`);
    } 

    foundUser.RoleId            = params.role;
    foundUser.mod_id            = params.username; // UserId
    foundUser.concurrency_ts    = new Date();

    const updatedUser = await foundUser.save({raw: true});

    return updatedUser.toJSON();
}

async function updatePoints(params) {   
    var retVal = {};
    var adjustment = {};

    if ((!params.point_id && !params.reward_id) || (params.point_id && params.reward_id)) throw Error('Must be associated with either a point or reward, but not both');

    if (params.point_id) {
        const foundPoint = await db.Points.findOne({ where: { id: params.point_id } });

        if (!foundPoint) throw Error('This point could not be found.');

        const pointData = foundPoint.dataValues;        
        
        adjustment.PointId     = pointData.id;
        adjustment.Points      = pointData.value;
    }

    if (params.reward_id) {
        const foundReward = await db.Rewards.findOne({ where: { id: params.reward_id } });

        if (!foundReward) throw Error('This reward could not be found.');

        const rewardData = foundReward.dataValues;

        adjustment.RewardId    = rewardData.id;
        adjustment.Points      = -1 * rewardData.value;
    }
    
    adjustment.UserId          = params.user_id;
    adjustment.create_id       = params.username;
    adjustment.mod_id          = params.username;
    adjustment.concurrency_ts  = new Date();

    await db.UsersPoints.create(adjustment)
        .then((newAdjustment) => {
            
            if (newAdjustment.id) {
                const {updatedAt, mod_id, ...cleanAdjustment } = newAdjustment.dataValues

                if (cleanAdjustment.createdAt) {
                    var createdAt = new Date(cleanAdjustment.createdAt);
                        createdAt = dtfns.format(createdAt, 'MMM. d, yyyy')

                    cleanAdjustment.createdAt = createdAt        
                }
                
                retVal = cleanAdjustment;
            }
        })
        .catch((err) => {
            throw Error('Could not adjust points. Please try again.');
        });
        
    return retVal
}

async function authenticate({ username, password }) {
    const login = await db.Logins.findOne({ where: { username } });

    if (!login || !(await bcrypt.compare(password, login.p_hash)))
        throw Error('The username or password you entered is incorrect.');

    const id = login.UserId;
    const user = await db.Users.findOne({ where: { id } });
    const token = jwt.sign({ sub: login.id, id: id }, process.env.SECRET, { expiresIn: '1d' });

    return { ...omitLoginDetails(login.get()), ...omitUserDetails(user.get()), token };
}

function omitLoginDetails(login) {
    const { id, p_hash, create_id, mod_id, create_date, mod_date, concurrency_ts, ...cleanLogin } = login;

    cleanLogin.id = cleanLogin.UserId;
    delete cleanLogin.UserId;

    return cleanLogin;
}

function omitUserDetails(user) {
    const { create_id, mod_id, create_date, mod_date, concurrency_ts, ...cleanUser } = user;    
    return cleanUser;
}