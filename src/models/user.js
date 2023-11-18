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

      this.hasOne(models.CandidateDetail, {
        foreignKey: "user_id",
        as: "candidate_detail",
      });
      this.hasOne(models.CompanyDetail, {
        foreignKey: "user_id",
        as: "company_detail",
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
    img: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users'

  });
  return User;
};