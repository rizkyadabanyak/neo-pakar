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
const Permission = db.Permission;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class PermissionsService {

  async addPermission(role_id, access) {


    try {
      const data = await Permission.create({
        role_id: role_id,
        access: access,
      });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("permission gagal ditambahkan");

    }
  }


  async getYouPermission(role_id) {
    const tmp_data = await Permission.findAll({
      where : {
        role_id : role_id
      }
    });

    let data = [];


    tmp_data.forEach(function(object) {
      // Your code to operate on object properties goes here
      // console.log(`Name: ${object.access}}`);
      data.push(object.access);
    });

    try {
      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }
  }
}

module.exports = PermissionsService;
