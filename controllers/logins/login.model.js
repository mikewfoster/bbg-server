const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        username: { type: DataTypes.STRING(50), allowNull: false },
        u_id: { type: DataTypes.INTEGER(11), allowNull: false },
        p_hash: { type: DataTypes.STRING, allowNull: false },
        create_id: { type: DataTypes.STRING(50), allowNull: false },
        mod_id: { type: DataTypes.STRING(50), allowNull: false },
        concurrency_ts: { type: DataTypes.DATE, allowNull: false }
    };

    const options = {
        defaultScope: {
            attributes: { exclude: ['p_hash'] }
        },
        scopes: {
            withHash: { attributes: {}, }
        },
        timestamps: true,
        createdAt: 'create_date',
        updatedAt: 'mod_date'
    };

    return sequelize.define('Logins', attributes, options);
}