const { Pool } = require("pg");
const InvariantError = require("../../../exceptions/InvariantError");
const db = require("../../../models");
const Authentications = db.Authentications;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class AuthenticationsService {

  async addRefreshToken(refresh_token) {

    try {
      const data = await Authentications.create({
        refresh_token: refresh_token
      });

    }catch (e) {

      console.log(e)
      throw new InvariantError("token gagal ditambahkan");

    }
  }

  async verifyRefreshToken(refresh_token) {


    const data = await Authentications.findOne({ where: { refresh_token: refresh_token } });



    if (!data){
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {

    // console.log('sini')
    // return;
    const rowsDeleted = await Authentications.destroy({
      where: {
        refresh_token : token
      }
    });
    //
    // await this.verifyRefreshToken(token);
    //
    // const query = {
    //   text: "DELETE FROM authentications WHERE token = $1",
    //   values: [token],
    // };
    //
    // await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
