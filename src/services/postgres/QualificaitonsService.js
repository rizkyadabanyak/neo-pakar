const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Qualification = db.Qualification;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginationHelper = require("../../helpers/paginationHelper");


class QualificaitonsService {

  async addQualification(name,description) {

    await this.verifyNewQualification(name);

    const slug_data = slug(name, '-');



    try {
      const data = await Qualification.create({
        name: name,
        slug: slug_data,
        description: description,
      });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }
  async updateQualification(id, name, description) {


    await this.verifyNewQualification(name );
    const slug_data = slug(name, '_');

    try {
      const data = await Qualification.update(
          {
            // Define the new values you want to set
            name: name,
            slug: slug_data,
            description: description,
          },
          {
            where: {
            id : id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("Qualification gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await Qualification.update(
          {
            // Define the new values you want to set
            status: status,
          },
          {
            where: {
            id : id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal dihapus");

    }
  }

  async verifyNewQualification(name ) {

    const cek_username = await Qualification.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan Qualification. qualification sudah ada.");
    }
  }

  async getQualificationAll(page_tmp,size_tmp,search_tmp) {

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

      const models = await Qualification.findAndCountAll({
        where: condition,
        limit,
        offset,
      });

      const response = paginationHelper.getPagingData(models, page, limit);
      return response;

    }catch (e) {
      console.log(e)
      throw new NotFoundError("terjadi kesalahan");

    }

  }

  async getQualificationById(id) {
    const data = await Qualification.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("Qualification tidak ditemukan");
    }
    return data;
  }

}

module.exports = QualificaitonsService;
