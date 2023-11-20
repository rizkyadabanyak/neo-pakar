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
    const slug_data = slug(name, '-');

    await this.verifyNewTimeExperience(null,slug_data);


    try {
      const data = await TimeExperience.create({
        name: name,
        slug: slug_data,
        description: description,
      });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("TimeExperience gagal ditambahkan");

    }
  }
  async updateTimeExperience(id, name, description) {

    const slug_data = slug(name, '_');

    await this.verifyNewTimeExperience(id,slug_data );

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
      const return_value = await TimeExperience.findOne({
        where : {
          id : id
        }
      })

      return return_value;

    }catch (e) {

      console.log(e)
      throw new InvariantError("TimeExperience gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

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


  async verifyNewTimeExperience(id,slug) {
    const id_data = id || '';

    const condition = id_data
        ? {
          [Op.and]: {
            slug: slug,
            id:{[Op.ne]:id}
          }
        }
        : {
          [Op.and]: {
            slug: slug,
          }
        };

    const cek = await TimeExperience.findOne({
      where: condition
    });

    if (cek) {
      throw new InvariantError("Gagal :D. TimeExperience sudah ada.");
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
