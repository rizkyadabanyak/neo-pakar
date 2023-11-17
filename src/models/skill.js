'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Job, {
        through: 'combination_job_skills',
        foreignKey: "job_id",
        otherKey: "skill_id",
        as: "Job",
      });

      this.belongsToMany(models.CandidateDetail, {
        through: "combination_candidate_skills",
        foreignKey: "candidate_id",
        otherKey: "skill_id",
        as: "CandidateDetail",
      });

    }
  }
  Skill.init({
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
    modelName: 'Skill',
    tableName: 'skills'

  });
  return Skill;
};