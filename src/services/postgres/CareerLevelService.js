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


class CareerLevelService {

  async addCareerLevel(name,description) {

    await this.verifyNewCareerLevel(name);

    const slug_data = slug(name, '-');



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


    await this.verifyNewCareerLevel(name );
    const slug_data = slug(name, '_');

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

      return data;

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

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal dihapus");

    }
  }

  async verifyNewCareerLevel(name ) {

    const cek_username = await CareerLevel.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan CareerLevel. CareerLevel sudah ada.");
    }
  }

  async getCareerLevelAll() {


    try {

      const data = await CareerLevel.findAll({
        where : {
          status : true
        }
      });


      return data;

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
