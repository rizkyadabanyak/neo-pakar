const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug= require('slug');
const db = require("../../models");
const fs = require("fs");
const Job = db.Job;
const Skill = db.Skill;
const User = db.User;
const combination_candidate_skills = db.combination_candidate_skills;
const CandidateDetail = db.CandidateDetail;
const CompanyDetail = db.CompanyDetail;
const uploadFileHelper = require("../../helpers/uploadFileHelper");
const Sequelize = require("sequelize");
const paginationHelper = require("../../helpers/paginationHelper");
const Op = Sequelize.Op;

class CompanyVerifService {

  async newCompanySetVerif(status,username) {
      // const data =
    const resultBefore = await User.findOne(
        {
          attributes: ['id','username', 'email', 'full_name', 'img',],
          include: [
            {
              association: 'company_detail',
            },
          ],
          where: {
            username : username
          },
        }
    );
    if (!resultBefore){
        throw new NotFoundError("User Company Tidak ada");
    }


    const data = await CompanyDetail.update({
        status_verif : status
    },{
        where:{
            user_id : resultBefore.id
        }
    });

    const result = await User.findOne(
          {
              attributes: ['username', 'email', 'full_name', 'img',],
              include: [
                  {
                      association: 'company_detail',
                  },
              ],
              where: {
                  username : username
              },
          }
      );
    return result
  }
  async getNewCompanyByUsername(username) {
    const data = await User.findOne(
        {
          attributes: ['username', 'email', 'full_name', 'img',],
          include: [
            {
              association: 'company_detail',
              where:{
                status_verif:{ [Sequelize.Op.not]: true}
              }
            },
          ],
          where: {
            username : username
          },
        }
    );

    if (!data){
      throw new NotFoundError("User Company Tidak ada");

    }
    return data;
  }
  async getAllNewCompany(page_tmp,size_tmp,search_tmp) {

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

      const models = await User.findAndCountAll({
        attributes: ['username', 'email', 'full_name', 'img',],
        include: [
          {
            association: 'company_detail',
            where:{
              status_verif:{ [Sequelize.Op.not]: true}
            }
          },
        ],
        where: condition,
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

module.exports = CompanyVerifService;
