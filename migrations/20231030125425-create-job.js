'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_type_work_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'job_type_works',
          },
          key: 'id'
        },
        allowNull: false
      },
      qualification_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'qualifications',
          },
          key: 'id'
        },
        allowNull: false
      },
      career_level_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'career_levels',
          },
          key: 'id'
        },
        allowNull: false
      },
      time_experiences_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'time_experiences',
          },
          key: 'id'
        },
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      salary_max: {
        type: Sequelize.INTEGER
      },
      salary_min: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable('jobs');
  }
};