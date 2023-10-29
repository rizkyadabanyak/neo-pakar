const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const {Candidate} = require("../../modelss/Candidate");
const slug= require('slug');

class CandidatesService {

  async addCandidate({ name,username,confPassword,email,password,address,phone_number }) {

    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const data = await Candidate.create({
        candidate_name: name,
        candidate_username: username,
        candidate_email: email,
        candidate_password: hashPassword,
        candidate_address: address,
        candidate_phone_number: phone_number,
      });

      return data.candidate_id;

    }catch (e) {

      throw new InvariantError("User gagal ditambahkan");

    }
  }

  async verifyNewUsername(username) {
    const company = await Candidate.findOne({ where: { candidate_username: username } });



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

  async verifyCandidateCredential(username, password) {




    const data = await Candidate.findOne({ where: { candidate_username: username } });





    if (!data) {
      throw new InvariantError("Kredensial yang Anda berikan salah");
    }

    const match = await bcrypt.compare(password, data.candidate_password);

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

  async allCompany() {
    const data = await Company.findAll();

    return data;
  }
}

module.exports = CandidatesService;
