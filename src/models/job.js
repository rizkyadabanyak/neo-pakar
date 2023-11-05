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