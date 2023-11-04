const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Job = db.Job;
const User = db.User;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class JobsService {

  async addJob(name,description) {

    await this.verifyNewJob(name);

    const slug_data = slug(name, '-');



    try {
      const data = await Job.create({
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
  async updateJob(id, name, description) {


    await this.verifyNewJob(name );
    const slug_data = slug(name, '_');

    try {
      const data = await Job.update(
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
      throw new InvariantError("Job gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await Job.update(
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

  async verifyNewJob(name ) {

    const cek_username = await Job.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan Job. skill sudah ada.");
    }
  }

  async getJobAll(userId) {


    try {

      const data = await Job.findAll({
        where : {
          status : true
        }
      });


      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }

  }

  async getJobById(id) {
    const data = await Job.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("Job tidak ditemukan");
    }
    return data;
  }

}

module.exports = JobsService;
