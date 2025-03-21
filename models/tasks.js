'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Tasks extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Tasks.init(
        {
            user_id: DataTypes.INTEGER,
            note: DataTypes.STRING,
            reward_id: DataTypes.INTEGER,
            point_id: DataTypes.INTEGER,
            create_id: DataTypes.STRING(50),
            mod_id: DataTypes.STRING(50),
            completed: DataTypes.DATE,
            concurrency_ts: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Tasks',
        }
    );
    return Tasks;
}