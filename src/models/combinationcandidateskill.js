'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CombinationCandidateSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CombinationCandidateSkill.init({
    candidate_id: DataTypes.INTEGER,
    skill_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'combination_candidate_skills',
  });
  return CombinationCandidateSkill;
};