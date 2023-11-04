const ClientError = require("../../exceptions/ClientError");

const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");

const {jwtDecode} = require("jwt-decode");
const InvariantError = require("../../exceptions/InvariantError");

class rolesHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.storeRoleHandler = this.storeRoleHandler.bind(this);
    this.getAllRoleHandler = this.getAllRoleHandler.bind(this);
    this.getAllRoleNoAuthHandler = this.getAllRoleNoAuthHandler.bind(this);
    this.getRoleByIdHandler = this.getRoleByIdHandler.bind(this);
    this.updateRoleHandler = this.updateRoleHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
  }

  async storeRoleHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_create_role"])

      this._validator.validateRolesPayload(request.payload);
      const { name, description } = request.payload;

      const data = await this._service.addRole(name, description);

      const response = h.response({
        status: "success",
        message: "Role berhasil ditambahkan",
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
  async updateRoleHandler(request, h) {
    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_update_role"])

      const { role_id } = request.params;
      this._validator.validateRolesPayload(request.payload);
      const { name, description } = request.payload;

      const data = await this._service.updateRole(role_id, name, description);

      const response = h.response({
        status: "success",
        message: "Role berhasil dirubah",
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

  async getAllRoleHandler(request, h) {

    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_show_role"])

      const data = await this._service.getRoleAll(true);

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
  async getAllRoleNoAuthHandler(request, h) {

    try {

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_show_role"])

      const data = await this._service.getRoleAll(false);

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

  async getRoleByIdHandler(request, h) {
    try {
      const { role_id } = request.params;

      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_show_role"])

      const data = await this._service.getRoleById(role_id)

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
      const { role_id } = request.params;
      const { status } = request.payload;
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_role","can_delete_role"])

      const data = await this._service.deleteById(role_id,status)

      return {
        status: "success",
        data: data,
        message: "Role berhasil dihapus",
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
