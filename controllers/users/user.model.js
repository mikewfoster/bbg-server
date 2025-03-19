const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        email: { type: DataTypes.STRING, allowNull: true },
        last_name: { type: DataTypes.STRING, allowNull: true },
        first_name: { type: DataTypes.STRING, allowNull: true },
        RoleId: { type: DataTypes.INTEGER(3), allowNull: false },
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

    return sequelize.define('Users', attributes, options);
}