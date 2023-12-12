'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.JobTypeWork, {
        foreignKey: "job_type_work_id",
        as: "job_type_work",
      });

      this.belongsTo(models.CompanyDetail, {
        foreignKey: "company_detail_id",
        as: "company_detail",
      });

      this.belongsTo(models.Qualification, {
        foreignKey: "qualification_id",
        as: "qualification",
      });

      this.belongsTo(models.CareerLevel, {
        foreignKey: "career_level_id",
        as: "career_level",
      });

      this.belongsTo(models.TimeExperience, {
        foreignKey: "time_experiences_id",
        as: "time_experiences",
      });

      this.hasMany(models.combination_candidate_jobs, {
        foreignKey: "job_id",
        as: "combinationCandidateJobs",
      });

      this.belongsToMany(models.Skill, {
        through: "combination_job_skills",
        foreignKey: "job_id",
        otherKey: "skill_id",
        as: "Skill",
      });

      this.belongsToMany(models.CandidateDetail, {
        through: "combination_candidate_jobs",
        foreignKey: "job_id",
        otherKey: "candidate_id",
        as: "CandidateDetail",
      });


      // this.hasMany(models.Skill, {
      //   through: "combination_job_skills",
      //   foreignKey: "job_id",
      //   otherKey: "skill_id",
      //   as: "Skill",
      // });
    }
  }
  Job.init({
    company_detail_id: {
      type: DataTypes.INTEGER
    },
    job_type_work_id: {
      type: DataTypes.INTEGER
    },
    qualification_id: {
      type: DataTypes.INTEGER
    },
    career_level_id: {
      type: DataTypes.INTEGER
    },
    time_experiences_id: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },slug: {
      type: DataTypes.STRING
    },description: {
      type: DataTypes.TEXT
    },
    start_date: {
      type: DataTypes.DATE
    },
    end_date: {
      type: DataTypes.DATE
    },
    salary_max: {
      type: DataTypes.INTEGER
    },
    salary_min: {
      type: DataTypes.INTEGER
    },
    count_apply_job: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    sequelize,
    modelName: 'Job',
    tableName: 'jobs',
  });
  return Job;
};