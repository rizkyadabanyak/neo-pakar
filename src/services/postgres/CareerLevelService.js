const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const CareerLevel = db.CareerLevel;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const paginationHelper = require("../../helpers/paginationHelper");


class CareerLevelService {

  async addCareerLevel(name,description) {
    const slug_data = slug(name, '-');

    await this.verifyNewCareerLevel(null,slug_data);




    try {
      const data = await CareerLevel.create({
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
  async updateCareerLevel(id, name, description) {

    const slug_data = slug(name, '-');

    await this.verifyNewCareerLevel(id,slug_data );

    try {
      const data = await CareerLevel.update(
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
      const return_value = await CareerLevel.findOne({
        where : {
          id : id
        }
      })

      return return_value;


    }catch (e) {

      console.log(e)
      throw new InvariantError("CareerLevel gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await CareerLevel.update(
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
      const return_value = await CareerLevel.findOne({
        where : {
          id : id
        }
      })

      return return_value;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal dihapus");

    }
  }


  async verifyNewCareerLevel(id,slug) {
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

    const cek = await CareerLevel.findOne({
      where: condition
    });

    if (cek) {
      throw new InvariantError("Gagal :D. CareerLevel sudah ada.");
    }
  }

  async getCareerLevelAll(page_tmp,size_tmp,search_tmp) {
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

      const models = await CareerLevel.findAndCountAll({
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

  async getCareerLevelById(id) {
    const data = await CareerLevel.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("CareerLevel tidak ditemukan");
    }
    return data;
  }

}

module.exports = CareerLevelService;
