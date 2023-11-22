const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug= require('slug');
const db = require("../../models");
const Job = db.Job;
const Skill = db.Skill;
const User = db.User;
const paginationHelper = require("../../helpers/paginationHelper");

class CandidatesService {

  async getUsersByUsername(username) {
    const query = {
      text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
      values: [`%${username}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getCandidate(page_tmp,size_tmp,search_tmp,skill_tmp) {
    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const skill = skill_tmp || '';
    const { limit, offset } = await paginationHelper.getPagination(page, size);

    // if (typeof skill == 'string'){
    //   console.log("sendirian");
    //
    // }else {
    //   for (let i=0;i<skill_tmp.length;i++){
    //     skill[i] = parseInt(skill_tmp[i])
    //   }
    // }
    // return ;

    const conditionUser = search
        ? {
          [Op.and]: {
            full_name: { [Op.iLike]: `%${search}%` },
            role_id: 3
          },
        }
        : {
          role_id: 3
        };

    const conditionSkill = search
        ? {
          [Op.and]: {
            full_name: { [Op.iLike]: `%${search}%` },
            role_id: 3
          },
        }
        : {
          role_id: 3
        };

    try {

      const models = await User.findAndCountAll({
        where: conditionUser,
        distinct: true,
        // col: 'User.id',
        attributes : ['id','username','email','full_name'],
        include: [
          {
            association: 'candidate_detail',
            where : {
              status_completed: true,
            },
            include:{
              association: 'Skill',
              where : {
                id : skill
              }
            }
          },
        ],
        limit,
        offset,
      });
      const response = paginationHelper.getPagingData(models, page, limit);
      return response;
    }catch (e) {
      console.log(e)
      throw new NotFoundError("terjadi kesalahan");

    }

  }
}

module.exports = CandidatesService;
