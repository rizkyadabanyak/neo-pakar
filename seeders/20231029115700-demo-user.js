'use strict';
const bcrypt = require("bcrypt");

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
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash('112233', salt);
    return queryInterface.bulkInsert('users', [
      {
        full_name: 'admin',
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashPassword,
        role_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        full_name: 'company',
        username: 'company',
        email: 'company@gmail.com',
        password: hashPassword,
        role_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },{
        full_name: 'candidate',
        username: 'candidate',
        email: 'candidate@gmail.com',
        password: hashPassword,
        role_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('users', null, {});

  }
};
