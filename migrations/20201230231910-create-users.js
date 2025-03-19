'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('Users', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            email: { 
                type: Sequelize.STRING, 
                allowNull: true 
            },
            last_name: { 
                type: Sequelize.STRING, 
                allowNull: true 
            },
            first_name: { 
                type: Sequelize.STRING, 
                allowNull: true 
            },
            RoleId: { 
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
        return queryInterface.dropTable('Users');
    },
};
