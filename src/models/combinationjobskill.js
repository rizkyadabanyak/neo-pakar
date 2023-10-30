'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CombinationJobSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CombinationJobSkill.init({
    job_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'combination_job_skills',
  });
  return CombinationJobSkill;
};