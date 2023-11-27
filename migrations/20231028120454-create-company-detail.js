'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('company_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: false
      },
      address: {
        type: Sequelize.TEXT
      },
      about_company: {
        type: Sequelize.TEXT
      },
      phone_number: {
        type: Sequelize.BIGINT
      },
      status_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status_verif: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status_disband: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('company_details');
  }
};