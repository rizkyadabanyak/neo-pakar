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
const uploadFileHelper = require("../../helpers/uploadFileHelper");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class CandidateDetailService {
  async verifySkill(skill ) {

    // console.log(skill.length);
    // return ;

    skill.forEach(function (param){
      let data = Skill.findOne({
        where:{
          id : param
        }
      });

      if (!data) {
        throw new NotFoundError("Skill tidak ditemukan");
      }
    })


    // for (let i=0;i<skill.length;i++){
    //   // console.log(i);
    //
    //
    //   console.log(data)
    //   console.log('itung = '+ skill[i])
    //   // if (!data) {
    //   //   throw new NotFoundError("Skill tidak ditemukan");
    //   // }
    // }

    // return;
  }
  async addSkillCandidate(skill,candidate_id) {

    // return skill;
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

      console.log(skill_tmp);
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

  async getCandidateDetail(user_id) {
    try {
      const data = await User.findOne({
        attributes : ['username','email','full_name','img',],
        include: [
          {
            association: 'candidate_detail',
            include:[
              {
                association: 'Skill',
                attributes:['name','slug']
              }
            ]
          },
        ],
        where:{
          id:user_id
        }
      });
      return data;

    }catch (e) {
      console.log(e)
      throw new InvariantError("candidates detail gagal diload");
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

  async addTmpCandidateDetail(user_id,phone_number) {
    // console.log("xxxx"+phone_number+"XXX"+user_id)
    try {
      await CandidateDetail.create({
        user_id: user_id,
        phone_number:phone_number
      });
      console.log("success"+phone_number)

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
  async setCV(path_cv,user_id) {

    const setCv = await CandidateDetail.update(
        {
          cv: path_cv,
        },
        {
          where: {
            user_id : user_id
          }
        }
    );
    return setCv;
  }

  async updateCandidateDetail(payload,username,user_id) {

    const image_profile = payload.image_profile;
    const cv_file = payload.cv_file;

    let path_profile,path_cv;

    if (image_profile) {
      path_profile = await uploadFileHelper.upload(image_profile,"image_profile",username);
      const setImgUser = await this.setImgUser(path_profile,user_id);

    }

    if (cv_file) {
      path_cv = await uploadFileHelper.upload(cv_file,"cv_file",username);
      const setCV = await this.setCV(path_cv,user_id);

    }

    const setCandidateDetail = await CandidateDetail.update(
        {
          address: payload.address,
          phone_number: payload.phone_number,
          description: payload.description,
          status_completed: true,
        },
        {
          where: {
            user_id : user_id
          }
        }
    );
    console.log(setCandidateDetail)
  }
}

module.exports = CandidateDetailService;
