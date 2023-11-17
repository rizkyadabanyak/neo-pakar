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
const paginationHelper = require("../../helpers/paginationHelper");
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

  async getRoleAll(auth,page_tmp,size_tmp,search_tmp) {
    let models = null;

    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const { limit, offset } = await paginationHelper.getPagination(page, size);

    const condition = search
        ? {
          [Op.or]: {
            name: { [Op.iLike]: `%${search}%` },
          },
        }
        : null;

    try {
      if (auth) {

        models = await Role.findAndCountAll({
          where: condition,
          limit,
          offset,
        });

      }else {

        models = await Role.findAndCountAll({
          where: {
            [Op.or]: {
              name: { [Op.iLike]: `%${search}%` },
            },
            name: {
              [Op.and]: [
                { [Op.ne]:'admin'}, // Greater than 25
                { [Op.ne]:'company_employee'}, // Less than 40
              ],
            },
          },
          limit,
          offset,
        });

      }
      const response = paginationHelper.getPagingData(models, page, limit);
      return response;

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
