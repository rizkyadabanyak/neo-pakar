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
const paginationHelper = require("../../helpers/paginationHelper");


class SkillsService {

  async addSkill(name,description) {

    await this.verifyNewSkill(name);

    const slug_data = slug(name, '-');



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
  async itsMyUniq(id, slug) {
    const cek_data = await Skill.findOne({
      where: {
        slug: slug,
        id : id
      }
    });

    if (cek_data) {
      return false
    }
    return true;
  }
  async updateSkill(id, name, description) {
    const slug_data = slug(name, '_');

    const cekMyUniq = await this.itsMyUniq(id,slug_data);

    if (cekMyUniq == true){

    }else {

    }
    await this.verifyNewSkill(name);

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
            id : id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("Skill gagal ditambahkan");

    }
  }
  async deleteById(id, status) {

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

  async verifyNewSkill(name ) {

    const cek_username = await Skill.findOne({ where: { name: name } });
    if (cek_username) {
      throw new InvariantError("Gagal menambahkan Skill. skill sudah ada.");
    }
  }

  async getSkillAll(page_tmp,size_tmp,search_tmp) {


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

      const models = await Skill.findAndCountAll({
        where: condition,
        limit,
        offset,
      });

      const response = paginationHelper.getPagingData(models, page, limit);
      return response;

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
