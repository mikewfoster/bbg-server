'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class UsersPoints extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            this.belongsTo(models.Points, {
                foreignKey: {
                    name: 'PointId',
                    allowNull: true
                },
                as: 'Point'
              });

            this.belongsTo(models.Rewards, {
                foreignKey: {
                    name: 'RewardId',
                    allowNull: true
                },
                as: 'Reward'
            });
          
              this.belongsTo(models.Users, {
                foreignKey: 'UserId',
                as: 'User'
            });
        }
    }
    UsersPoints.init(
        {
            RewardId: DataTypes.INTEGER,
            PointId: DataTypes.INTEGER,
            UserId: { type: DataTypes.INTEGER, allowNull: false },
            Points: { type: DataTypes.INTEGER, allowNull: false },
            create_id: { type: DataTypes.STRING(50), allowNull: false },
            mod_id: { type: DataTypes.STRING(50), allowNull: false },
            concurrency_ts: { type: DataTypes.DATE, allowNull: false }
        },
        {
            sequelize,
            modelName: 'UsersPoints',
        }
    );
    return UsersPoints;
}