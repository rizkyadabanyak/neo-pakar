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


class PermissionsService {

  async addPermission(role_id, access) {



    return console.log(email)
    return ;

    const id = `user-${nanoid(16)}`;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const slug_data = slug(name, '_');

    try {
      const company = await User.create({
        role_id: 2,
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
    const data = await User.findAll();

    try {
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

module.exports = PermissionsService;
