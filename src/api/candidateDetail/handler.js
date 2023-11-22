const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");

class rolesHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.getCandidateDetailHandler = this.getCandidateDetailHandler.bind(this);
    this.updateCandidateDetailHandler = this.updateCandidateDetailHandler.bind(this);

    this.getAllSkillHandler = this.getAllSkillHandler.bind(this);
    this.updateSkillHandler = this.updateSkillHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
    this.addSkillHandler = this.addSkillHandler.bind(this);
  }
  async getCandidateDetailHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_show_detail_profile"])

      const data = await this._service.getCandidateDetail(decode_user_id)

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

  async addSkillHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as

      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_add_skill_candidate_behavior"])

      this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)

      const detail_candidate_id = candidate_detail.candidate_detail.id;
      // return h.response({
      //   status: "success",
      //   data: candidate_detail.candidate_detail.id,
      // });

      // const { name, description } = request.payload;

      const data = await this._service.addSkillCandidate(request.payload.skill,detail_candidate_id);

      const response = h.response({
        status: "success",
        message: "skill candidates berhasil ditambahkan",
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


  async updateCandidateDetailHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as

      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_update_profile_candidate_behavior"])

      this._validator.validateCandidateDetailPayload(request.payload);

      // return h.response({
      //   status: "success",
      //   data: request.payload,
      // });

      // const { name, description } = request.payload;

      const data = await this._service.updateCandidateDetail(request.payload,decode_username_as,decode_user_id);

      const response = h.response({
        status: "success",
        message: "cadidate detail berhasil ditambahkan",
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
