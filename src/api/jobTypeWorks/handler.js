const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");

class jobTypeWorksHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.storeJobTypeWorkHandler = this.storeJobTypeWorkHandler.bind(this);
    this.getAllJobTypeWorkHandler = this.getAllJobTypeWorkHandler.bind(this);
    this.getJobTypeWorkByIdHandler = this.getJobTypeWorkByIdHandler.bind(this);
    this.updateJobTypeWorkHandler = this.updateJobTypeWorkHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
  }

  async storeJobTypeWorkHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job_type_work","can_create_job_type_work"])

      this._validator.validateMasterDataPayload(request.payload);
      const { name, description } = request.payload;

      const data = await this._service.addJobTypeWork(name, description);

      const response = h.response({
        status: "success",
        message: "JobTypeWork berhasil ditambahkan",
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
  async updateJobTypeWorkHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job_type_work","can_update_job_type_work"])

      const { job_type_work_id } = request.params;
      this._validator.validateMasterDataPayload(request.payload);
      const { name, description } = request.payload;

      // return description;
      const data = await this._service.updateJobTypeWork(job_type_work_id, name, description);

      const response = h.response({
        status: "success",
        message: "JobTypeWork berhasil dirubah",
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

  async getAllJobTypeWorkHandler(request, h) {

    try {
      const { page,size,search } = request.query;


      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job_type_work","can_show_job_type_work"])



      const data = await this._service.getJobTypeWorkAll(page,size,search );

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

  async getJobTypeWorkByIdHandler(request, h) {
    try {
      const { job_type_work_id } = request.params;

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job_type_work","can_show_job_type_work"])

      const data = await this._service.getJobTypeWorkById(job_type_work_id)

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
      const { job_type_work_id } = request.params;
      const { status } = request.payload;
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job_type_work","can_delete_job_type_work"])

      const data = await this._service.deleteById(job_type_work_id,status)

      return {
        status: "success",
        data: data,
        message: "JobTypeWork berhasil dihapus",
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

module.exports = jobTypeWorksHandler;
