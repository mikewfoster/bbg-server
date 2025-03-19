'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Rewards', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            title: { 
                type: Sequelize.STRING, 
                allowNull: false 
            },
            description: {
                type: Sequelize.STRING, 
                allowNull: true 
            },
            link: {
                type: Sequelize.STRING, 
                allowNull: true 
            },
            value: {
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
        return queryInterface.dropTable('Rewards');
    },
};
