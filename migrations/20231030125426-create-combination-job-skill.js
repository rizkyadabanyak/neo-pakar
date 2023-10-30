'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('combination_job_skills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'jobs',
          },
          key: 'id'
        },
        allowNull: false
      },
      skill_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'skills',
          },
          key: 'id'
        },
        allowNull: false
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
    await queryInterface.dropTable('combination_job_skills');
  }
};