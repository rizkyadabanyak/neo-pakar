const ClientError = require("../../exceptions/ClientError");
const permissionsHelper = require("../../helpers/permissionsHelper");


class permissionsHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.storePermissionHandler = this.storePermissionHandler.bind(this);
    this.getListPermissionHandler = this.getListPermissionHandler.bind(this);
  }

  async storePermissionHandler(request, h) {
    try {

      // return h.response({
      //   status: request.payload,
      // });

      const { role_id, access } = request.payload;

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

}

module.exports = permissionsHandler;
