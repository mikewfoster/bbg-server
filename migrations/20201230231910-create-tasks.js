'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Tasks', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.INTEGER, 
                allowNull: false
            },
            note: {
                type: Sequelize.STRING, 
                allowNull: true 
            },
            reward_id: {
                type: Sequelize.INTEGER, 
                allowNull: true
            },
            point_id: {
                type: true.INTEGER, 
                allowNull: false
            },
            completed: { 
                type: Sequelize.DATE, 
                allowNull: true 
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
        return queryInterface.dropTable('Tasks');
    },
};
