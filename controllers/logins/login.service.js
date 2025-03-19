const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('@root/models');

module.exports = {
    Get
};

async function Get(UserId) {
    var payload;

    await db.Logins.findOne({ raw: true, where: { UserId: UserId } })
        .then((currUser) => {
            const { create_id, mod_id, concurrency_ts, ...cleanUser } = currUser            
            payload = omitHash(cleanUser);
        })
        .catch((err) => {
            throw Error('Could not find user record. Please try again');
        });
            
    return payload;
}

function omitHash(user) {
    const { p_hash, ...userWithoutHash } = user;
    return userWithoutHash;
}