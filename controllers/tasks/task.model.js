const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        user_id: {type: DataTypes.INTEGER, allowNull: false },
        note: { type: DataTypes.STRING, allowNull: true },
        reward_id: {type: DataTypes.INTEGER, allowNull: true },
        point_id: {type: DataTypes.INTEGER, allowNull: true },
        create_id: { type: DataTypes.STRING(50), allowNull: false },
        mod_id: { type: DataTypes.STRING(50), allowNull: false },
        completed: { type: DataTypes.DATE, allowNull: true },
        concurrency_ts: { type: DataTypes.DATE, allowNull: false }
    };

    const options = {
        defaultScope: {
        },
        scopes: {
        },
        timestamps: true,
        createdAt: 'create_date',
        updatedAt: 'mod_date'
    };

    return sequelize.define('Points', attributes, options);
}