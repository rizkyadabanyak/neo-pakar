'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CandidateDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Skill, {
        through: "combination_candidate_skills",
        foreignKey: "candidate_id",
        otherKey: "skill_id",
        as: "Skill",
      });

      this.belongsToMany(models.Job, {
        through: "combination_candidate_jobs",
        foreignKey: "job_id",
        otherKey: "candidate_id",
        as: "Job",
      });
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  CandidateDetail.init({
    user_id: {
      type: DataTypes.INTEGER
    }, cv: {
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('cv');
        return process.env.BASE_URL_BACKEND +"/images/" + rawValue;
      }
    },
    address: {
      type: DataTypes.TEXT
    },
    phone_number: {
      type: DataTypes.BIGINT
    },
    description: {
      type: DataTypes.TEXT
    },
    status_completed: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'CandidateDetail',
    tableName: 'candidate_details',
  });
  return CandidateDetail;
};