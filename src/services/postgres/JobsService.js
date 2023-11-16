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
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const CombinationJobSkill = db.combination_job_skills;


class JobsService {
  async addSkillJob(job_id,skill){

    // console.log(skill);


    try {

      skill.forEach( async (data) => {
        await CombinationJobSkill.create({
          job_id: job_id,
          skill_id: data,
        });

      });

    }catch (e) {

      console.log(e)
      throw new InvariantError("job gagal ditambahkan");

    }
  }

  async addJob(company_detail_id,payload) {
    //
    // this.addSkillJob(data.id,payload.skill);
    await this.verifyNewJob(payload);


    const slug_data = slug(payload.name, '-');
    // console.log(slug_data)
    // return ;

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

  async getJobAll(company_detail) {
    try {
      const data = await Job.findAll({
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
        where : {
          company_detail_id : company_detail.id
        }
      });
      return data;
    }catch (e) {
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
