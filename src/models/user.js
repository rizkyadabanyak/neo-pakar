'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }

  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    full_name: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'

  });
  return User;
};