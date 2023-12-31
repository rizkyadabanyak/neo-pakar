'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
    }
  }
  Permission.init({
    role_id: DataTypes.STRING,
    access: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Permission',
    tableName: 'permissions'

  });
  return Permission;
};