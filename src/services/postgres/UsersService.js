const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");
// const users = require("../../models/user");
const db = require("../../models");
const CandidateDetailService = require("../../services/postgres/CandidateDetailService");
const candidateDetailService = new CandidateDetailService;
const CompanyDetailService = require("../../services/postgres/CompanyDetailService");
const companyDetailService = new CompanyDetailService;
const Role = db.Role;
const User = db.User;

const Sequelize = require('sequelize');
const paginationHelper = require("../../helpers/paginationHelper");
const Op = Sequelize.Op;


class UsersService {

  async addUser({ name,username,confPassword , email,address, password,as,role_id ,phone_number}) {

    await this.verifyNewUserCompany(username,email);


    const id = `user-${nanoid(16)}`;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const slug_data = slug(name, '-');

    try {
      const user = await User.create({
        role_id: role_id,
        full_name: name,
        slug: slug_data,
        username: username,
        email: email,
        address: address,
        password: hashPassword
      });

      if (role_id == 2){
        companyDetailService.addTmpCompanyDetail(user.id,phone_number);
        console.log('company');
      }else {

        candidateDetailService.addTmpCandidateDetail(user.id,phone_number);
        console.log('candidate');
      }
      return user.id;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }
  async updateUsers({ user_id,name,username,confPassword , email,address, password,as,role_id ,phone_number}) {

    await this.verifyNewUserCompany(username,email);


    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const slug_data = slug(name, '-');

    try {
      const user = await User.update({
        role_id: role_id,
        full_name: name,
        slug: slug_data,
        username: username,
        email: email,
        password: hashPassword
      },{
        where: {
          id : user_id
        }
      });

      if (role_id == 2){
        companyDetailService.addTmpCompanyDetail(user.id,phone_number);
        console.log('company');
      }else {

        candidateDetailService.addTmpCandidateDetail(user.id,phone_number);
        console.log('candidate');
      }
      return user.id;

    }catch (e) {

      console.log(e)
      throw new InvariantError("User gagal ditambahkan");

    }
  }

  async verifyNewUserCompany(username,email) {

    // const data = await User.findAll();
    // const data = await User.findAll({ include: { association: 'role' } });


    const cek_username = await User.findOne({ where: { username: username } });
    const cek_email = await User.findOne({ where: { email: email } });


    if (cek_username) {
      throw new InvariantError("Gagal menambahkan user. Username sudah digunakan.");
    }

    if (cek_email) {
      throw new InvariantError("Gagal menambahkan user. Email sudah digunakan.");
    }
  }

  async getUserAll(page_tmp,size_tmp,search_tmp,role_tmp) {


    const page = page_tmp || 0;
    const size = size_tmp || 10;
    const search = search_tmp || '';
    const role = role_tmp || '';
    const { limit, offset } = await paginationHelper.getPagination(page, size);

    let condition ;

    if (search && role){
      condition = {
        [Op.and]: {
          full_name: {[Op.iLike]: `%${search}%`},
          role_id: role,
        }
      };
    }else if(search){
      // console.log('sini')
      condition = {
        [Op.or]: {
          full_name: {[Op.iLike]: `%${search}%`},
        }
      };
    }else if (role){
      console.log('sini')
      condition = {
        [Op.or]: {
          role_id: role,
        }
      };
    }else {
      condition = null;
    }

    try {

      const models = await User.findAndCountAll({
        where: condition,
        limit,
        offset,
      });

      const response = paginationHelper.getPagingData(models, page, limit);
      return response;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }

  }

  async getProfile(decodeJwt) {
    var data ;
    try {

      data = await User.findOne({
        where:{
          id : decodeJwt.id
        }
      });

      return data;

    }catch (e) {
      throw new NotFoundError("profile tidak ditemukan");
    }

  }

  async verifyUserCredential(username, password) {

    const data = await User.findOne({
      where: { username: username },
      include: { association: 'role' }
    });



    if (!data) {
      throw new InvariantError("Kredensial yang Anda berikan salah");
    }

    const match = await bcrypt.compare(password, data.password);

    if (!match) {
      throw new AuthenticationError("Kredensial yang Anda berikan salah");
    }
    return data;
  }

  async getUserByid(user_id) {
    var data ;
    try {

      const cekRole = await User.findOne({
        where:{
          id : user_id,
        }
      });

      if (cekRole.role_id == 2){

        data = await User.findOne({
          where :{
            [Op.and]: {
              id : cekRole.id,
              role_id: cekRole.role_id,
            },
          },
          include: [
            {
              association: 'company_detail',
            },
          ]
        });

      }else {
        data = await User.findOne({

          where :{
            [Op.and]: {
              id : cekRole.id,
              role_id: cekRole.role_id,
            },
          },
          include: [
            {

              association: 'candidate_detail',
              include:{
                association: 'Skill',
              }
            },

          ]
        });

      }
      return data;

    }catch (e) {
      throw new NotFoundError("profile tidak ditemukan");
    }
  }
}

module.exports = UsersService;
