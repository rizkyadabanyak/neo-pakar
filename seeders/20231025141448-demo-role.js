'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert('roles', [
        {
          name: 'admin',
          description: 'ini role buat admin',
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'company',
          description: 'ini role buat company',
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'candidate',
          description: 'ini role buat candidate',
          createdAt: new Date(),
          updatedAt: new Date()
        },{
          name: 'company_employee',
          description: 'ini role buat company_employee',
          createdAt: new Date(),
          updatedAt: new Date()
        },
    ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('roles', null, {});

  }
};
