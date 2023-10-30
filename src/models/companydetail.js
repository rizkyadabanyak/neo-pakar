'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CompanyDetail.init({
    address: {
      type: DataTypes.TEXT
    },
    about_company: {
      type: DataTypes.TEXT
    },
    phone_number: {
      type: DataTypes.INTEGER
    },
    status_disband: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'CompanyDetail',
  });
  return CompanyDetail;
};