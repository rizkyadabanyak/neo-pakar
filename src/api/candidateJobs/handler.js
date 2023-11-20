const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");

class rolesHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.applyJobsHandler = this.applyJobsHandler.bind(this);
    this.showApplyJobsHandler = this.showApplyJobsHandler.bind(this);
  }
  async applyJobsHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { slug_job } = request.params;
      const { description,type_request } = request.payload;

      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)
      const detail_candidate_id = candidate_detail.candidate_detail.id;

      // return h.response({
      //   status: "success",
      //   message: candidate_detail,
      // });

      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_apply_job_candidate","can_given_offer_company_behavior"])

      // this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const data = await this._service.applyJobs(slug_job,detail_candidate_id,description,type_request)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "skill candidate berhasil ditambahkan",
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
  async showApplyJobsHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as

      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)
      const detail_candidate_id = candidate_detail.candidate_detail.id;
      const { page,size,search,status,type_request } = request.query;

      // return h.response({
      //   status: "success",
      //   message: candidate_detail,
      // });

      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_show_apply_job_candidate","can_show_apply_job_company_behavior"])

      // this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const data = await this._service.showApplyJobs(detail_candidate_id,page,size,search,status,type_request)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "skill candidate berhasil ditambahkan",
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
        message: "Maaf, terjadi kegagalan pada server kami test.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

}

module.exports = rolesHandler;
