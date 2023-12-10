const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");
const CompaniesService = require("../../services/postgres/CompaniesService");
const companiesService = new CompaniesService();

class rolesHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.getCompanyDetailHandler = this.getCompanyDetailHandler.bind(this);
    this.updatecompanyDetailHandler = this.updatecompanyDetailHandler.bind(this);
    this.getCountJobHandler = this.getCountJobHandler.bind(this);
  }
  async getCountJobHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_show_detail_profile_company"])

      const data = await this._service.getCountJob(decode_user_id)

      return {
        status: "success",
        data: data,
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async getCompanyDetailHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_show_detail_profile_company"])

      const data = await this._service.getCompanyDetail(decode_user_id)

      return {
        status: "success",
        data: data,
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }


  async updatecompanyDetailHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as

      const company_detail = await companiesService.cekCompanyDetail(decode_user_id);

      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_update_profile_company_behavior"])

      this._validator.validateCompanyDetailPayload(request.payload);


      // const { name, description } = request.payload;

      const data = await this._service.updateCompanyDetail(request.payload,decode_username_as,decode_user_id);

      const response = h.response({
        status: "success",
        message: "company detail berhasil ditambahkan",
        data: data,
      });
      response.code(200);
      return response;

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
  async updateSkillHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_skill","can_update_skill"])

      const { skill_id } = request.params;
      this._validator.validateSkillsPayload(request.payload);
      const { name, description } = request.payload;

      const data = await this._service.updateSkill(skill_id, name, description);

      const response = h.response({
        status: "success",
        message: "Skill berhasil dirubah",
        data: data,
      });
      response.code(201);
      return response;

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getAllSkillHandler(request, h) {

    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_skill","can_show_skill"])



      const data = await this._service.getSkillAll();

      return {
        status: "success",
        data: data,
      };

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deleteByIdHandler(request, h) {
    try {
      const { skill_id } = request.params;
      const { status } = request.payload;
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_skill","can_delete_skill"])

      const data = await this._service.deleteById(skill_id,status)

      return {
        status: "success",
        data: data,
        message: "Skill berhasil dihapus",
      };

    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "failed",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

}

module.exports = rolesHandler;
