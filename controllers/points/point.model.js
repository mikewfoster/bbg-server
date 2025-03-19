const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
        value: {type: DataTypes.INTEGER, allowNull: false },
        create_id: { type: DataTypes.STRING(50), allowNull: false },
        mod_id: { type: DataTypes.STRING(50), allowNull: false },
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