const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Role = db.Role;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class RolesService {

  async addRole(name,description) {

    await this.verifyNewRole(name );


    try {
      const data = await Role.create({
        name: name,
        description: description,
      });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }
  async updateRole(role_id, name, description) {


    await this.verifyNewRole(name );

    try {
      const data = await Role.update(
          {
            // Define the new values you want to set
            name: name,
            description: description,
          },
          {
            where: {
            id : role_id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }
  async deleteById(role_id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await Role.update(
          {
            // Define the new values you want to set
            status: status,
          },
          {
            where: {
            id : role_id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal dihapus");

    }
  }

  async verifyNewRole(name ) {

    const cek_username = await Role.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan Role. role sudah ada.");
    }
  }

  async getRoleAll(userId) {


    try {

      const data = await Role.findAll({
        where : {
          status : true
        }
      });


      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }

  }

  async getRoleById(id) {
    const data = await Role.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("Role tidak ditemukan");
    }
    return data;
  }

}

module.exports = RolesService;
