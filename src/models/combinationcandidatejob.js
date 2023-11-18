'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CombinationCandidateJob extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CombinationCandidateJob.init({
    job_id: DataTypes.INTEGER,
    candidate_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM,
      values: ['processed', 'accepted', 'rejected']
    },
    type_request: {
      type: DataTypes.ENUM,
      values: ['candidate_propose', 'given_offer']
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: 'combination_candidate_jobs',
  });
  return CombinationCandidateJob;
};