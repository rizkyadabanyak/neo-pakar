const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const TimeExperience = db.TimeExperience;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginationHelper = require("../../helpers/paginationHelper");


class TimeExperiencesService {

  async addTimeExperience(name,description) {

    await this.verifyNewTimeExperience(name);

    const slug_data = slug(name, '-');



    try {
      const data = await TimeExperience.create({
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
  async updateTimeExperience(id, name, description) {


    await this.verifyNewTimeExperience(name );
    const slug_data = slug(name, '_');

    try {
      const data = await TimeExperience.update(
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
      throw new InvariantError("TimeExperience gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await TimeExperience.update(
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

  async verifyNewTimeExperience(name ) {

    const cek_username = await TimeExperience.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan TimeExperience. TimeExperience sudah ada.");
    }
  }

  async getTimeExperienceAll(page_tmp,size_tmp,search_tmp) {

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

      const models = await TimeExperience.findAndCountAll({
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

  async getTimeExperienceById(id) {
    const data = await TimeExperience.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("TimeExperience tidak ditemukan");
    }
    return data;
  }

}

module.exports = TimeExperiencesService;
