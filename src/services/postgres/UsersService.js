const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Role = db.Role;
const User = db.User;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class UsersService {

  async addUserCompany({ name,username,confPassword , email,address, password,as,role_id }) {

    await this.verifyNewUserCompany(username,email);


    // return console.log(email)
    // return ;

    const id = `user-${nanoid(16)}`;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const slug_data = slug(name, '-');



    try {
      const company = await User.create({
        role_id: role_id,
        full_name: name,
        slug: slug_data,
        username: username,
        email: email,
        address: address,
        password: hashPassword
      });

      return company.id;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }

  async verifyNewUserCompany(username,email) {

    // const data = await User.findAll();
    // const data = await User.findAll({ include: { association: 'role' } });


    const cek_username = await User.findOne({ where: { username: username } });
    const cek_email = await User.findOne({ where: { email: email } });


    if (cek_username) {
      throw new InvariantError("Gagal menambahkan user. Username sudah digunakan.");
    }

    if (cek_email) {
      throw new InvariantError("Gagal menambahkan user. Email sudah digunakan.");
    }
  }

  async getUserAll(userId) {

    try {
      const data = await User.findAll();

      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

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
  async getProfile(decodeJwt) {
    var data ;
    try {

      data = await User.findOne({
        where:{
          id : decodeJwt.id
        }
      });

      return data;

    }catch (e) {
      throw new NotFoundError("profile tidak ditemukan");
    }

  }

  async verifyUserCredential(username, password) {

    const data = await User.findOne({
      where: { username: username },
      include: { association: 'role' }
    });



    if (!data) {
      throw new InvariantError("Kredensial yang Anda berikan salah");
    }

    const match = await bcrypt.compare(password, data.password);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return data;
  }

  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
