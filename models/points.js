'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Points extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
        }
    }
    Points.init(
        {
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            value: DataTypes.INTEGER,
            create_id: DataTypes.STRING(50),
            mod_id: DataTypes.STRING(50),
            concurrency_ts: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'Points',
        }
    );
    return Points;
}