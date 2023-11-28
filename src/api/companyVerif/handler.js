const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");
const CompaniesService = require("../../services/postgres/CompaniesService");
const companiesService = new CompaniesService();

class CompanyVerifHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.getNewCompanyHandler = this.getNewCompanyHandler.bind(this);
    this.getNewCompanyByUsernameHandler = this.getNewCompanyByUsernameHandler.bind(this);
    this.newCompanySetVerifHandler = this.newCompanySetVerifHandler.bind(this);
  }
  async getNewCompanyByUsernameHandler(request, h) {
    try {
      const { page,size,search } = request.query;
      const { username } = request.params;

      // return {
      //   status: "success",
      //   data: "xxx",
      // };

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,[""])



      const data = await this._service.getNewCompanyByUsername(username);

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
  async getNewCompanyHandler(request, h) {
    try {
      const { page,size,search } = request.query;

      // return {
      //   status: "success",
      //   data: "xxx",
      // };

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,[""])



      const data = await this._service.getAllNewCompany(page,size,search);

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


  async newCompanySetVerifHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const decode_user_id= decodeJwt.id;
      const decode_username_as= decodeJwt.username_as
      const { username } = request.params;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_company_behavior","can_update_profile_company_behavior"])

      this._validator.validateCompanyVerifPayload(request.payload);


      const { status } = request.payload;

      const data = await this._service.newCompanySetVerif(status,username);

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

}

module.exports = CompanyVerifHandler;
