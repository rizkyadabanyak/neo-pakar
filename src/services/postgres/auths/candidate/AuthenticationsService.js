const { Pool } = require("pg");
const InvariantError = require("../../../../exceptions/InvariantError");
const {Candidate} = require("../../../../models/Candidate");

class AuthenticationsService {

  async addRefreshToken(company_id,accessToken,refresh_token) {

    await Candidate.update({
      company_token: accessToken,
      company_refresh_token: refresh_token
    },{
      where:{
        company_id: company_id
      }
    });
  }

  async verifyRefreshToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    await this.verifyRefreshToken(token);

    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
