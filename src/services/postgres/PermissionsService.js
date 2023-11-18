const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthenticationError = require("../../exceptions/AuthenticationError");
const slug = require("slug");

const db = require("../../models");
const Role = db.Role;
const Permission = db.Permission;

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


class PermissionsService {

  async cekDbPermissionOnRole(role_id,data){
    const result = await Permission.findOne({
      where:{
        role_id:role_id,
        access:data
      }
    });
    return result;
  }
  async deletePermissionOnRole(role_id){
    const result = await Permission.destroy({
      where:{
        role_id:role_id,
      }
    });
    return result;
  }




  async addPermission(role_id, access) {
    let create_datas = [];

    if (typeof access != "string"){

      for (const data of access){

        const data_cek = await this.cekDbPermissionOnRole(role_id,data)

        if (data_cek){
          await this.deletePermissionOnRole(role_id)
        }

        create_datas.push({
          role_id:role_id,
          access:data
        })


      }
    }else {
      const data_cek = await this.cekDbPermissionOnRole(role_id,access)

      if (data_cek){
        await this.deletePermissionOnRole(role_id)
      }

      create_datas.push({
        role_id:role_id,
        access:access
      })
    }



    try {
      const data = await Permission.bulkCreate(create_datas);

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("permission gagal ditambahkan");

    }
  }
  async getPermissionOnRole() {


    try {
      const data = await Role.findAll({ include: { association: 'permission' } });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("permission gagal ditambahkan");

    }
  }  async getPermissionOnRoleById(role_id) {


    try {
      const data = await Role.findOne({
        include: { association: 'permission' },
        where:{
          id:role_id
        }
      });

      return data;

    }catch (e) {

      console.log(e)
      throw new InvariantError("permission gagal ditambahkan");

    }
  }


  async getYouPermission(role_id) {
    const tmp_data = await Permission.findAll({
      where : {
        role_id : role_id
      }
    });

    let data = [];


    tmp_data.forEach(function(object) {
      // Your code to operate on object properties goes here
      // console.log(`Name: ${object.access}}`);
      data.push(object.access);
    });

    try {
      return data;

    }catch (e) {
      throw new NotFoundError("terjadi kesalahan");

    }
  }
}

module.exports = PermissionsService;
