'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Logins extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Logins.init(
        {
            username: DataTypes.STRING(50),
            p_hash: DataTypes.STRING,
            create_id: DataTypes.STRING(50),
            mod_id: DataTypes.STRING(50),
            concurrency_ts: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Logins',
        }
    );
    return Logins;
}