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
      throw new InvariantError("candidate detail gagal ditambahkan");

    }
  }

  async getCandidateDetail(user_id) {
    const data = await User.findOne({
      attributes : ['username','email','full_name','img',],
      include: [
        {
          association: 'CandidateDetail',
        },
      ],
      where:{
        id:user_id
      }
    });

    return data;
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
    // console.log("xxxx"+phone_number)
    try {
      await CandidateDetail.create({
        user_id: user_id,
        phone_number:phone_number
      });
    }catch (e) {

      console.log(e)
      throw new InvariantError("candidate detail gagal ditambahkan");

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

  async updateCandidateDetail(payload,username,user_id) {

    const image_profile = payload.image_profile;
    const cv_file = payload.cv_file;

    let path_profile,path_cv;

    if (image_profile) {
      path_profile = await uploadFileHelper.upload(image_profile,"image_profile",username);
    }else {
      throw new InvariantError("file img profile tidak ada");
    }

    if (cv_file) {
      path_cv = await uploadFileHelper.upload(cv_file,"cv_file",username);
    }else {
      throw new InvariantError("cv file tidak ada");
    }


    const setImgUser = await this.setImgUser(path_profile,user_id);
    console.log(setImgUser)

    const setCandidateDetail = await CandidateDetail.update(
        {
          address: payload.address,
          cv: path_cv,
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
