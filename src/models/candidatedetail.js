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
      // define association here
    }
  }
  CandidateDetail.init({
    user_id: {
      type: DataTypes.INTEGER
    }, cv: {
      type: DataTypes.STRING
    },
    address: {
      type: DataTypes.TEXT
    },
    phone_number: {
      type: DataTypes.INTEGER
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