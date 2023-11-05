const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");
const CompaniesService = require("../../services/postgres/CompaniesService");
const companiesService = new CompaniesService();
const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");

class jobsHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.storeJobHandler = this.storeJobHandler.bind(this);
    this.getAllJobHandler = this.getAllJobHandler.bind(this);
    this.getJobByIdHandler = this.getJobByIdHandler.bind(this);
    this.getJobBySlugHandler = this.getJobBySlugHandler.bind(this);
    this.updateJobHandler = this.updateJobHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
  }

  async storeJobHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const user_id = decodeJwt.id;

      const company_detail = await companiesService.cekCompanyDetail(user_id);

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_create_job"])

      // return h.response({
      //   status: "success",
      //   data: company_detail,
      // });

      this._validator.validateJobsPayload(request.payload);
      // const { name, description } = request.payload;

      const data = await this._service.addJob(company_detail.id, request.payload);

      const response = h.response({
        status: "success",
        message: "Job berhasil ditambahkan",
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
  async updateJobHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const user_id = decodeJwt.id;

      const company_detail = await companiesService.cekCompanyDetail(user_id);

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_update_job"])

      const { job_id } = request.params;
      this._validator.validateJobsPayload(request.payload);
      const { name, description } = request.payload;

      const data = await this._service.updateJob(job_id,company_detail.id, request.payload);

      const response = h.response({
        status: "success",
        message: "Job berhasil dirubah",
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

  async getAllJobHandler(request, h) {

    try {


      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const user_id = decodeJwt.id;

      const company_detail = await companiesService.cekCompanyDetail(user_id);

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_show_job"])


      const data = await this._service.getJobAll(company_detail);

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

  async getJobByIdHandler(request, h) {
    try {
      const { job_id } = request.params;

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_show_job"])

      const data = await this._service.getJobById(job_id)

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
  async getJobBySlugHandler(request, h) {
    try {
      const { slug } = request.params;


      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_show_job"])

      const data = await this._service.getJobBySlug(slug)

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
      const { job_id } = request.params;
      const { status } = request.payload;
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_delete_job"])

      const data = await this._service.deleteById(job_id,status)

      return {
        status: "success",
        data: data,
        message: "Job berhasil dihapus",
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

module.exports = jobsHandler;
