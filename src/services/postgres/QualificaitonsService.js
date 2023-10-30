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
  async updateQualification(skill_id, name, description) {


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
            id : skill_id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("Qualification gagal ditambahkan");

    }
  }
  async deleteById(skill_id, status) {

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
            id : skill_id
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

  async getQualificationAll() {


    try {

      const data = await Qualification.findAll({
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

  async getQualificationById(id) {
    const data = await Qualification.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("Qualification tidak ditemukan");
    }
    return data;
  }

}

module.exports = QualificaitonsService;
