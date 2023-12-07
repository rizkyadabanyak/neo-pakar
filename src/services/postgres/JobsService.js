const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
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

    const slug_data = slug(payload.name, '-');

    await this.verifyNewJob(null,slug_data);
    await this.verifySkill(payload.skill);

// return ;
    try {
      const job = await Job.create({
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

      const skill_tmp = await Skill.findAll({
        where :{
          id : payload.skill
        }
      })

      if (job && skill_tmp) {
        // Menambahkan skill ke user
        // await testCandidate.addSkill(testSkill);
        await job.setSkill(skill_tmp);

        console.log('Skill added to cn successfully.');
      } else {
        console.log('User or skill not found.');
      }
      return job;

    }catch (e) {

      console.log(e)
      throw new InvariantError("job gagal ditambahkan");

    }
  }
  async updateJob(id,company_detail_id, payload) {
    const slug_data = slug(payload.name, '-');

    // await this.verifyNewJob(payload);
    await this.verifyNewJob(id,slug_data);

    await this.verifyYouJobCompany(id,company_detail_id);
    await this.verifySkill(payload.skill);


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
      const job = await Job.findOne(
          {
            where: {
            id : id
            }
          }
      );
      const skill_tmp = await Skill.findAll({
        where :{
          id : payload.skill
        }
      })

      if (job && skill_tmp) {
        // Menambahkan skill ke user
        // await testCandidate.addSkill(testSkill);
        await job.setSkill(skill_tmp);

        console.log('Skill added to cn successfully.');
      } else {
        console.log('User or skill not found.');
      }
      return job;

    }catch (e) {

      console.log(e)
      throw new InvariantError("Job gagal ditambahkan");

    }
  }
  async deleteById(id,company_detail_id, payload, status) {

    // console.log(company_detail_id);
    return company_detail_id;
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




  async verifyNewJob(id,slug) {
    const id_data = id || '';

    const condition = id_data
        ? {
          [Op.and]: {
            slug: slug,
            id:{[Op.ne]:id}
          }
        }
        : {
          [Op.and]: {
            slug: slug,
          }
        };

    const cek = await Job.findOne({
      where: condition
    });

    if (cek) {
      throw new InvariantError("Gagal :D. Job sudah ada.");
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


  async getJobAll(as,page_tmp,size_tmp,search_tmp,career_levels_tmp,job_type_works_tmp,skill_tmp) {
    let role;


    if (typeof as == "object"){
      role = "company"
    }else {
      role = as
    }


    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const career_levels = career_levels_tmp || '';
    const job_type_works = job_type_works_tmp || '';
    const skill = skill_tmp || '';

    const { limit, offset } = await paginationHelper.getPagination(page, size);

    try {
      const conditionSkill = skill
          ? {
            id: skill,
          }
          : null;

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

      let condition_career_level,condition_job_type_works ;

      if (career_levels&&job_type_works){
        condition_career_level = {
          id:career_levels
        }
        condition_job_type_works = {
          id: job_type_works
        }
      }else if (career_levels){
        // console.log('sini')
        condition_career_level = {
          id:career_levels
        }
      }else if (job_type_works){
        condition_job_type_works = {
          id: job_type_works
        }
      }else {
        condition_career_level= null;
        condition_job_type_works= null;
      }

      models = await Job.findAndCountAll({
        include:[
          {
            association: 'job_type_work',
            attributes : ['id','name'],
            where:condition_job_type_works

          }, {
            association: 'qualification',
            attributes : ['name']
          },{
            association: 'career_level',
            attributes : ['id','name'],
            where:condition_career_level
          },{
            association: 'time_experiences',
            attributes : ['name']
          },{
            association: 'time_experiences',
            attributes : ['name']
          },{
            association: 'company_detail',
            attributes : ['address','about_company'],
            include :[{
              association: 'user',
              attributes : ['full_name','img'],

            }]
          },{
            association: 'Skill',
            where : conditionSkill
          }
        ],
        distinct: true,
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
        },{
          association: 'time_experiences',
          attributes : ['name']
        },{
          association: 'Skill',
          attributes : ['name','slug']
        },{
          association: 'company_detail',
          attributes : ['address','about_company'],
          include :[{
            association: 'user',
            attributes : ['full_name','img'],

          }]
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
        },{
          association: 'time_experiences',
          attributes : ['name']
        },{
          association: 'Skill',
          attributes : ['name','slug']

        },{
          association: 'company_detail',
          attributes : ['address','about_company'],
          include :[{
            association: 'user',
            attributes : ['full_name','img'],
          }]
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
