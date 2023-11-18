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
      this.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });

    }
  }
  CompanyDetail.init({
    user_id: {
      type: DataTypes.INTEGER
    },
    address: {
      type: DataTypes.TEXT
    },
    about_company: {
      type: DataTypes.TEXT
    },
    phone_number: {
      type: DataTypes.BIGINT
    },
    status_disband: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },status_completed: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'CompanyDetail',
    tableName: 'company_details',
  });
  return CompanyDetail;
};