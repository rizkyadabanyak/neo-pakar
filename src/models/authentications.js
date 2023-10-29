'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Authentications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Authentications.init({
    refresh_token: DataTypes.TEXT,

  }, {
    sequelize,
    modelName: 'Authentications',
    tableName: 'authentications'

  });
  return Authentications;
};