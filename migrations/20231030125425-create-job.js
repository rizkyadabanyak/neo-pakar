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
      company_detail_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'company_details',
          },
          key: 'id'
        },
        allowNull: false
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
      name: {
        type: Sequelize.STRING
      },
      slug: {
        type: Sequelize.STRING
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
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      salary_min: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
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