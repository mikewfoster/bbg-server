'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('UsersPoints', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            PointId: { 
                type: Sequelize.INTEGER, 
                allowNull: true 
            },
            RewardId: { 
                type: Sequelize.INTEGER, 
                allowNull: true 
            },
            Points: { 
                type: Sequelize.INTEGER, 
                allowNull: false 
            },
            UserId: { 
                type: Sequelize.INTEGER, 
                allowNull: false 
            },
            concurrency_ts: { 
                type: Sequelize.DATE, 
                allowNull: false 
            },
            create_id: { 
                type: Sequelize.STRING, 
                allowNull: false 
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            mod_id: { 
                type: Sequelize.STRING, 
                allowNull: false 
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('UsersPoints');
    },
};
