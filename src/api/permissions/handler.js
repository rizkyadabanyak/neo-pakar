const ClientError = require("../../exceptions/ClientError");
const permissionsHelper = require("../../helpers/permissionsHelper");
const decodeJWTHelper = require("../../helpers/decodeJWTHelper");


class permissionsHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.setRolePermissionHandler = this.setRolePermissionHandler.bind(this);
    this.getListPermissionHandler = this.getListPermissionHandler.bind(this);
    this.getPermissionOnRoleHandler = this.getPermissionOnRoleHandler.bind(this);
    this.getPermissionOnRoleByIdHandler = this.getPermissionOnRoleByIdHandler.bind(this);
  }

  async setRolePermissionHandler(request, h) {
    try {

      const { role_id } = request.params;
      // return h.response({
      //   status: role_id,
      // });

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_permission","can_set_permission"])

      // this._validator.validatePermissionPayload(request.payload);
      const {access } = request.payload;

      const userId = await this._service.addPermission(role_id, access);

      const response = h.response({
        status: "success",
        message: "berhasil menambahkan permission",
        data: {
          userId,
        },
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


  async getPermissionOnRoleByIdHandler(request, h) {
    try {
      const { role_id } = request.params;


      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_permission","can_show_permission"])

      const data = await this._service.getPermissionOnRoleById(role_id);

      // console.log(data);

      return h.response({
        status: "success",
        data: data,
      });


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
  async getListPermissionHandler(request, h) {
    try {
      const data = permissionsHelper.listPermission();
      console.log(data);
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

  async getPermissionOnRoleHandler(request, h) {
    try {
      const { skill_id } = request.params;
      return h.response({
        status: "success",
        data: skill_id,
      });

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_permission","can_show_permission"])

      const data = await this._service.getPermissionOnRole();

      // console.log(data);

      return h.response({
        status: "success",
        data: data,
      });


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

module.exports = permissionsHandler;
