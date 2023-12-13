const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");
const CompaniesService = require("../../services/postgres/CompaniesService");
const companiesService = new CompaniesService();

class candidateJobsHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.applyJobsHandler = this.applyJobsHandler.bind(this);
    this.acceptApplicationsHandler = this.acceptApplicationsHandler.bind(this);
    this.acceptOffersHandler = this.acceptOffersHandler.bind(this);
    this.givenOfferHandler = this.givenOfferHandler.bind(this);
    this.showApplyJobsHandler = this.showApplyJobsHandler.bind(this);
    this.candidateAcceptedAppliedHandler = this.candidateAcceptedAppliedHandler.bind(this);
    this.detailLamaranHandler = this.detailLamaranHandler.bind(this);
    this.detailLamaranlistCandidateHandler = this.detailLamaranlistCandidateHandler.bind(this);
  }
  async candidateAcceptedAppliedHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { slug_job } = request.params;
      const { description,type_request } = request.payload;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_apply_job_candidate","can_given_offer_company_behavior"])


      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)
      const detail_candidate_id = candidate_detail.candidate_detail.id;

      // return h.response({
      //   status: "success",
      //   message: candidate_detail,
      // });


      // this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const data = await this._service.applyJobs(slug_job,detail_candidate_id,description,type_request)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "Status berhasil dirubah",
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
  async applyJobsHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { slug_job } = request.params;
      const { description } = request.payload;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_apply_job_candidate"])

      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)
      const detail_candidate_id = candidate_detail.candidate_detail.id;



      // this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const data = await this._service.applyJobs(slug_job,detail_candidate_id,description)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "Anda berhasil melamar pekerjaan",
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
  async acceptApplicationsHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { candidate_job_id } = request.query;
      const { status } = request.payload;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_accept_Applications_behavior"])

      const company_detail = await companiesService.cekCompanyDetail(decode_user_id);
      const company_detail_id = company_detail.id;
      this._validator.validateAcceptApplicationPayload({candidate_job_id, status});

      // const detail_candidate_id = candidate_detail.candidate_detail.id;

      // return h.response({
      //   status: "success",
      //   message: company_detail_id,
      // });

      const data = await this._service.acceptApplication(candidate_job_id,company_detail_id,status)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "berhasil merubah status",
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
  async acceptOffersHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { candidate_job_id } = request.query;
      const { status } = request.payload;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_accept_offer_candidate"])

      const candidate_detail = await this._service.cekCandidateDetail(decode_user_id)
      const detail_candidate_id = candidate_detail.candidate_detail.id;

      this._validator.validateAcceptApplicationPayload({candidate_job_id, status});

      // const detail_candidate_id = candidate_detail.candidate_detail.id;

      // return h.response({
      //   status: "success",
      //   message: detail_candidate_id,
      // });

      const data = await this._service.acceptOffers(candidate_job_id,detail_candidate_id,status)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "berhasil merubah status",
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
  async givenOfferHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { job_id,candidate_id } = request.query;
      const { description } = request.payload;
      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_given_offer_company_behavior"])

      // const company_detail = await this._service.s(decode_user_id)
      const company_detail = await companiesService.cekCompanyDetail(decode_user_id);

      const detail_company_id = company_detail.id;

      // return h.response({
      //   status: "success",
      //   message: detail_company_id,
      // });

      // this._validator.validateCandidateDetailAddSkillPayload(request.payload);
      const data = await this._service.givenOffer(detail_company_id,job_id,candidate_id,description)

      // const { name, description } = request.payload;

      const response = h.response({
        status: "success",
        message: "Status berhasil dirubah",
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

        data = await this._service.allCandidateJobCompany(detail_company_id,page,size,search,status,type_request)
        console.log("detail_company_id = "+detail_company_id)
      }else {
        cek_detail = await this._service.cekCandidateDetail(decode_user_id)
        const detail_candidate_id = cek_detail.candidate_detail.id;

        data = await this._service.allCandidateJobCandidate(detail_candidate_id,page,size,search,status,type_request)
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
  async detailLamaranlistCandidateHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const decode_as= decodeJwt.as
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_show_apply_job_candidate","can_show_apply_job_company_behavior"])
      const { job_id } = request.params;
      const { page,size,search,status,type_request } = request.query;

      const data = await this._service.detailLamaranListCandidate(job_id,page,size,search,status,type_request)

      // return h.response({
      //   status: "success",
      //   message: candidate_job_id,
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
  async detailLamaranHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const decode_as= decodeJwt.as
      await permissionsHelper.cekPermission(decode_role_id,["can_all_candidate_behavior","can_all_company_behavior","can_show_apply_job_candidate","can_show_apply_job_company_behavior"])
      const { candidate_job_id } = request.params;


      const data = await this._service.detailLamaran(candidate_job_id)

      // return h.response({
      //   status: "success",
      //   message: candidate_job_id,
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

module.exports = candidateJobsHandler;
