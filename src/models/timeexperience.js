'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TimeExperience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TimeExperience.init({
    name: {
      type: DataTypes.STRING
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    description: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    sequelize,
    modelName: 'TimeExperience',
    tableName: 'time_experiences',
  });
  return TimeExperience;
};