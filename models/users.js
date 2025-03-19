'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.hasOne(models.Logins, {
                foreignKey: 'UserId'
            });
        }
    }
    Users.init(
        {
            email: DataTypes.STRING,
            last_name: DataTypes.STRING,
            first_name: DataTypes.STRING,
            create_id: DataTypes.STRING(50),
            mod_id: DataTypes.STRING(50),
            concurrency_ts: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Users',
        }
    );
    return Users;
}