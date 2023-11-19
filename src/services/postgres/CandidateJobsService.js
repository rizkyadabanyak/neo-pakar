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
const combination_candidate_jobs = db.combination_candidate_jobs;
const uploadFileHelper = require("../../helpers/uploadFileHelper");
const Sequelize = require("sequelize");
const paginationHelper = require("../../helpers/paginationHelper");
const Op = Sequelize.Op;
const CandidateDetail = db.CandidateDetail;

class CandidateDetailService {

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

  async convertSlugToIdJob(slug) {

    const data = await Job.findOne({
      where:{
        slug : slug
      }
    });

    if (!data){
      throw new InvariantError("Job tidak ada");

    }
    return data.id;
  }

  async verifApplyJobs(job_id,detail_candidate_id) {

    const data = await combination_candidate_jobs.findOne({
      where:{
        job_id : job_id,
        candidate_id : detail_candidate_id,
        status: "processed",
      }
    });

    if (data){
      throw new InvariantError("Proses apply anda sedang di prosess");
    }
    return data;
  }

  async showApplyJobs(detail_candidate_id,page_tmp,size_tmp,search_tmp,status_tmp) {


    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const status = status_tmp || '';
    const { limit, offset } = await paginationHelper.getPagination(page, size);

    // console.log(status);
    // return ;
    const condition = (status)
        ? {
          [Op.and]: {
            type_request : "candidate_propose",
            status : status,
          },
        }
        : {
          type_request : "candidate_propose"
        };


    try {

      const models = await combination_candidate_jobs.findAndCountAll({
        where: condition,
        include:[
          {
            association: 'job',
            where:{
              [Op.and]: {
                name: { [Op.iLike]: `%${search}%` },
              },
            },
            attributes:['name','slug'],
            include:[
                {
                  association:'company_detail',
                  attributes:['id'],
                  include:[
                    {
                      association:'user',
                      attributes:['img','full_name'],
                    }
                  ]
                }
            ]
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

  async applyJobs(slug_tmp,detail_candidate_id,description) {

    const job_id =  await this.convertSlugToIdJob(slug_tmp);

    await this.verifApplyJobs(job_id,detail_candidate_id)

    try {

      const data = await combination_candidate_jobs.create({
        job_id: job_id,
        candidate_id:detail_candidate_id,
        description:description,
        status: "processed",
        type_request: "candidate_propose",
      });

      return data;
    }catch (e) {

      console.log(e)
      throw new InvariantError("candidate detail gagal ditambahkan");

    }

  }

}

module.exports = CandidateDetailService;
