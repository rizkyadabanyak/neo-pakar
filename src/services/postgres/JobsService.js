const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const Job = db.Job;
const CompanyDetail = db.CompanyDetail;
const User = db.User;
const Skill = db.Skill;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CombinationJobSkill = db.combination_job_skills;
const paginationHelper = require("../../helpers/paginationHelper");



class JobsService {
  async addSkillJob(job_id,skill){

    try {

      for (let i=0;i<skill.length;i++){
        // console.log(i);
        await CombinationJobSkill.create({
          job_id: job_id,
          skill_id: skill[i],
        });
      }

    }catch (e) {

      console.log(e)
      throw new InvariantError("job gagal ditambahkan");

    }
  }

  async addJob(company_detail_id,payload) {

    // this.addSkillJob(data.id,payload.skill);

    await this.verifyNewJob(payload);
    await this.verifySkill(payload.skill);
    const slug_data = slug(payload.name, '-');

// return ;
    try {
      const data = await Job.create({
        company_detail_id: company_detail_id,
        name: payload.name,
        slug: slug_data,
        job_type_work_id: payload.job_type_work_id,
        qualification_id: payload.qualification_id,
        career_level_id: payload.career_level_id,
        time_experiences_id: payload.time_experiences_id,
        description: payload.description,
        start_date: payload.start_date,
        end_date: payload.end_date,
        salary_max: payload.salary_max,
        salary_min: payload.salary_min,
      });
      this.addSkillJob(data.id,payload.skill);

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("job gagal ditambahkan");

    }
  }
  async updateJob(id,company_detail_id, payload) {

    await this.verifyNewJob(payload);
    await this.verifyYouJobCompany(id,company_detail_id);

    const slug_data = slug(payload.name, '-');

    try {
      const data = await Job.update(
          {
            company_detail_id: company_detail_id,
            name: payload.name,
            slug: slug_data,
            job_type_work_id: payload.job_type_work_id,
            qualification_id: payload.qualification_id,
            career_level_id: payload.career_level_id,
            time_experiences_id: payload.time_experiences_id,
            description: payload.description,
            start_date: payload.start_date,
            end_date: payload.end_date,
            salary_max: payload.salary_max,
            salary_min: payload.salary_min,
          },
          {
            where: {
            id : id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("Job gagal ditambahkan");

    }
  }
  async deleteById(id,company_detail_id, payload, status) {

    // console.log(status);
    // return ;
    await this.verifyYouJobCompany(id,company_detail_id);

    try {
      const data = await Job.update(
          {
            // Define the new values you want to set
            status: status,
          },
          {
            where: {
            id : id
            }
          }
      );

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal dihapus");

    }
  }

  async verifyNewJob(payload ) {


    // console.log(payload.name)
    // return ;

    const cek = await Job.findOne({ where: { name: payload.name } });

    if (cek) {
      throw new InvariantError("Gagal menambahkan Job. job sudah ada.");
    }
  }
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

  async verifyYouJobCompany(id,company_detail_id ) {


    const cek = await Job.findOne({
      where: {
        company_detail_id: company_detail_id,
        id : id
      }
    });

    if (!cek) {
      throw new InvariantError("ini bukan job anda");
    }
  }


  async getJobAll(as,page_tmp,size_tmp,search_tmp) {
    let role;


    if (typeof as == "object"){
      role = "company"
    }else {
      role = as
    }


    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const { limit, offset } = await paginationHelper.getPagination(page, size);

    try {
      let models,condition;
      if (role == "company"){

        let company_detail = as;

        condition = search
            ? {
              [Op.and]: {
                name: { [Op.iLike]: `%${search}%` },
                company_detail_id : company_detail.id
              },
            }
            : {
              company_detail_id : company_detail.id
            };

      }else if (role == "admin"){

        condition = search
            ? {
              [Op.and]: {
                name: { [Op.iLike]: `%${search}%` },
              },
            }
            : null;
      }else {

        condition = search
            ? {
              [Op.and]: {
                name: { [Op.iLike]: `%${search}%` },
                status : true
              },
            }
            : {
              status : true
            };
      }

      models = await Job.findAndCountAll({
        include:[
          {
            association: 'job_type_work',
            attributes : ['name'],
          }, {
            association: 'qualification',
            attributes : ['name']
          },{
            association: 'career_level',
            attributes : ['name']
          },{
            association: 'time_experiences',
            attributes : ['name']
          },{
            association: 'time_experiences',
            attributes : ['name']
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

  async getJobById(id) {
    const data = await Job.findOne({
      include: [
        {
          association: 'job_type_work',
          attributes : ['name'],
        }, {
          association: 'qualification',
          attributes : ['name']
        },{
          association: 'career_level',
          attributes : ['name']
        },{
          association: 'time_experiences',
          attributes : ['name']
        },
      ],
      where: { id: id }
    });
    if (!data) {
      throw new NotFoundError("Job tidak ditemukan");
    }
    return data;
  }
  async getJobBySlug(slug) {
    const data = await Job.findOne({
      include: [
        {
          association: 'job_type_work',
          attributes : ['name'],
        }, {
          association: 'qualification',
          attributes : ['name']
        },{
          association: 'career_level',
          attributes : ['name']
        },{
          association: 'time_experiences',
          attributes : ['name']
        },
      ],
      where: { slug: slug }
    });
    if (!data) {

      throw new NotFoundError("Job tidak ditemukan");
    }
    return data;
  }

}

module.exports = JobsService;
