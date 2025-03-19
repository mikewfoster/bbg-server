'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Roles extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasMany(models.Users, {
                foreignKey: 'RoleId'
            });
        }
    }
    Roles.init(
        {
            code: DataTypes.STRING(3),
            title: DataTypes.STRING(50),
            description: DataTypes.STRING,
            create_id: DataTypes.STRING(50),
            mod_id: DataTypes.STRING(50),
            concurrency_ts: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Roles',
        }
    );
    return Roles;
}

