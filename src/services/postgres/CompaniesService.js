const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const {Company} = require("../../models/Company");
const slug= require('slug');

class CompaniesService {

  async addCompany({ name,username,confPassword , email,address, password }) {

    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const slug_data = slug(name, '_');

    try {
      const company = await Company.create({
        company_name: name,
        company_slug: slug_data,
        company_username: username,
        company_email: email,
        company_address: address,
        company_password: hashPassword
      });

      return company.company_id;

    }catch (e) {

      throw new InvariantError("User gagal ditambahkan");

    }
  }

  async verifyNewUsername(username) {
    const company = await Company.findOne({ where: { company_username: username } });



    if (company) {
      throw new InvariantError("Gagal menambahkan user. Username sudah digunakan.");
    }
  }

  async getUserById(userId) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE id = $1",
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("User tidak ditemukan");
    }

    return result.rows[0];
  }

  async verifyCompanyCredential(username, password) {


    const company = await Company.findOne({ where: { company_username: username } });



    if (!company) {
      throw new InvariantError("Kredensial yang Anda berikan salah");
    }

    const match = await bcrypt.compare(password, company.company_password);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return company;
  }

  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async allCompany() {
    const data = await Company.findAll();

    return data;
  }
}

module.exports = CompaniesService;
