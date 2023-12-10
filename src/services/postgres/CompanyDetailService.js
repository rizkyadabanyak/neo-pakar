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
const Op = Sequelize.Op;

class CompanyDetailService {
  async verifySkill(skill ) {

    for (let i=0;i<skill.length;i++){
      // console.log(i);
      let data = await Skill.findOne({
        where:{
          id : skill[i]
        }
      });

      if (!data) {
        throw new NotFoundError("Skill tidak ditemukan");
      }
    }

  }
  async addSkillCandidate(skill,candidate_id) {

    await this.verifySkill(skill);
    try {

      const candidate_tmp = await CandidateDetail.findOne({
        where :{
          id : candidate_id
        }
      })

      const skill_tmp = await Skill.findAll({
        where :{
          id : skill
        }
      })


      if (candidate_tmp && skill_tmp) {
        // Menambahkan skill ke user
        // await testCandidate.addSkill(testSkill);
        await candidate_tmp.setSkill(skill_tmp);

        console.log('Skill added to cn successfully.');
      } else {
        console.log('User or skill not found.');
      }

    }catch (e) {

      console.log(e)
      throw new InvariantError("candidates detail gagal ditambahkan");

    }
  }

  async getCompanyDetail(user_id) {
    try {
      const data = await User.findOne({
        attributes : ['username','email','full_name','img',],
        include: [
          {
            association: 'company_detail',
          },
        ],
        where:{
          id:user_id
        }
      });
      return data;

    }catch (e) {
      console.log(e)
      throw new InvariantError("company detail gagal diload");
    }

  }

  async cekCandidateDetail(user_id) {
    const data = await User.findOne({
      attributes : ['username','email','full_name','img',],
      include: [
        {
          association: 'candidate_detail',
          where : {
            status_completed: true,
          }
        },
      ],
      where:{
        id: user_id,
      }
    });
    if (!data){
      throw new InvariantError("Belum melengkapi cadidate detail");

    }

    return data;
  }

  async addTmpCompanyDetail(user_id,phone_number) {
    // console.log("xxxx"+phone_number+"XXX"+user_id)
    try {
      await CompanyDetail.create({
        user_id: user_id,
        phone_number:phone_number
      });
      console.log("success"+CompanyDetail)

    }catch (e) {

      console.log(e)
      // throw new InvariantError("candidates detail gagal ditambahkan");

    }
  }
  update
  async setImgUser(path,user_id) {


    const setImgUser = await User.update(
        {
          img: path,
        },
        {
          where: {
            id : user_id
          }
        }
    );

    return setImgUser;
  }

  async updateCompanyDetail(payload,username,user_id) {

    // console.log(payload)
    // return;

    const logo_company = payload.logo_company;

    let path_logo_company;

    if (logo_company) {
      path_logo_company = await uploadFileHelper.upload(logo_company,"logo_company",username);
      const setImgUser = await this.setImgUser(path_logo_company,user_id);

    }
    // console.log(setImgUser)
    //
    // return ;
    const setCompanyDetail = await CompanyDetail.update(
        {
          address: payload.address,
          phone_number: payload.phone_number,
          about_company: payload.about_company,
          status_completed: true,
        },
        {
          where: {
            user_id : user_id
          }
        }
    );
    console.log(setCompanyDetail)
    return setCompanyDetail

  }
}

module.exports = CompanyDetailService;
