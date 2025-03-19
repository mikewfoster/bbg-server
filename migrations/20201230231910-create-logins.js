'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Logins', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            username: { 
                type: Sequelize.STRING, 
                allowNull: false 
            },
            UserId: { 
                type: Sequelize.INTEGER, 
                allowNull: false 
            },
            p_hash: { 
                type: Sequelize.STRING, 
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
        return queryInterface.dropTable('Logins');
    },
};