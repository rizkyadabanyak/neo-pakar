'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('combination_candidate_jobs', {
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
      candidate_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'candidate_details',
          },
          key: 'id'
        },
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM,
        values: ['processed', 'accepted', 'rejected']
      },
      type_request: {
        type: Sequelize.ENUM,
        values: ['candidate_propose', 'given_offer']
      },
      description: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('combination_candidate_jobs');
  }
};