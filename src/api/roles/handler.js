const ClientError = require("../../exceptions/ClientError");
const permissionsHelper = require("../../helpers/permissionsHelper");
class rolesHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.storeRoleHandler = this.storeRoleHandler.bind(this);
    this.getAllRoleHandler = this.getAllRoleHandler.bind(this);
    this.getRoleByIdHandler = this.getRoleByIdHandler.bind(this);
    this.updateRoleHandler = this.updateRoleHandler.bind(this);
    this.deleteByIdHandler = this.deleteByIdHandler.bind(this);
  }

  async storeRoleHandler(request, h) {
    try {
      // return h.response({
      //   status: request.payload,
      // });

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
      const { role_id } = request.params;

      // return h.response({
      //   status: request.payload,
      // });

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

      const data = await this._service.getRoleAll({
        where: {
          status : true
        }
      });

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
