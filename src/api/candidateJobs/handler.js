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
      const decode_as= decodeJwt.as
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_show_apply_job_candidate","can_show_apply_job_company_behavior"])
      const { page,size,search,status,type_request } = request.query;


      let cek_detail,data;
      if (decode_as == "admin"){
        data = await this._service.allCandidateJob(page,size,search,status,type_request)

      }else if (decode_as == "company") {
        cek_detail = await this._service.cekCompanyDetail(decode_user_id)
        const detail_company_id = cek_detail.company_detail.id;

        data = await this._service.givenOffer(detail_company_id,page,size,search,status,type_request)
        console.log("detail_company_id = "+detail_company_id)
      }else {
        cek_detail = await this._service.cekCandidateDetail(decode_user_id)
        const detail_candidate_id = cek_detail.candidate_detail.id;

        data = await this._service.showApplyJobs(detail_candidate_id,page,size,search,status,type_request)
        console.log("detail_candidate_id = "+detail_candidate_id)

      }
      // return h.response({
      //   status: "success",
      //   message: cek_detai,
      // });

      const response = h.response({
        status: "success",
        message: "berhasilkan menampilkan data",
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
        message: "Maaf, terjadi kegagalan pada server kasmi test.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

}

module.exports = rolesHandler;
