const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const JobTypeWork = db.JobTypeWork;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class JobTypeWorksServiceService {

  async addJobTypeWork(name,description) {

    await this.verifyNewJobTypeWork(name);

    const slug_data = slug(name, '-');



    try {
      const data = await JobTypeWork.create({
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
  async updateJobTypeWork(id, name, description) {


    await this.verifyNewJobTypeWork(name );
    const slug_data = slug(name, '_');

    try {
      const data = await JobTypeWork.update(
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
      throw new InvariantError("JobTypeWork gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await JobTypeWork.update(
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

  async verifyNewJobTypeWork(name ) {

    const cek_username = await JobTypeWork.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan JobTypeWork. qualification sudah ada.");
    }
  }

  async getJobTypeWorkAll() {


    try {

      const data = await JobTypeWork.findAll({
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

  async getJobTypeWorkById(id) {
    const data = await JobTypeWork.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("JobTypeWork tidak ditemukan");
    }
    return data;
  }

}

module.exports = JobTypeWorksServiceService;
