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

  async getTimeExperienceAll() {


    try {

      const data = await TimeExperience.findAll({
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

  async getTimeExperienceById(id) {
    const data = await TimeExperience.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("TimeExperience tidak ditemukan");
    }
    return data;
  }

}

module.exports = TimeExperiencesService;
