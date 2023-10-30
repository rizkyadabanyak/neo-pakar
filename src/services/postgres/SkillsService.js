const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Skill = db.Skill;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class SkillsService {

  async addSkill(name,description) {

    await this.verifyNewSkill(name);

    const slug_data = slug(name, '_');



    try {
      const data = await Skill.create({
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
  async updateSkill(skill_id, name, description) {


    await this.verifyNewSkill(name );
    const slug_data = slug(name, '_');

    try {
      const data = await Skill.update(
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
      throw new InvariantError("Skill gagal ditambahkan");

    }
  }
  async deleteById(skill_id, status) {

    // console.log(status);
    // return ;
    try {
      const data = await Skill.update(
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

  async verifyNewSkill(name ) {

    const cek_username = await Skill.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan Skill. skill sudah ada.");
    }
  }

  async getSkillAll(userId) {


    try {

      const data = await Skill.findAll({
        where : {
          status : true
        }
      });


      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }

  }

  async getSkillById(id) {
    const data = await Skill.findOne({ where: { id: id } });
    if (!data) {
      throw new NotFoundError("Skill tidak ditemukan");
    }
    return data;
  }

}

module.exports = SkillsService;
