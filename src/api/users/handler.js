const ClientError = require("../../exceptions/ClientError");
const decodeJWTHelper = require("../../helpers/decodeJWTHelper");
const permissionsHelper = require("../../helpers/permissionsHelper");


class UsersHandler {
  constructor(service, validator) {

    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.updateUserHandler = this.updateUserHandler.bind(this);
    this.getUserAllHandler = this.getUserAllHandler.bind(this);
    this.getUserProfileHandler = this.getUserProfileHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      // return h.response({
      //   status: request.payload,
      // });
      //
      this._validator.validateUserPayload(request.payload);
      const { name,username,confPassword , email,address, password,phone_number,as,role_id } = request.payload;

      // this.sendSMSMessageTwillo(phone_number);

      const data = await this._service.addUser({ name,username,confPassword , email,address, password,as,role_id,phone_number});

      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
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
  async updateUserHandler(request, h) {
    try {
      const { user_id } = request.params;
      this._validator.validateUserPayload(request.payload);
      const { name,username,confPassword , email,address, password,phone_number,as,role_id } = request.payload;

      // this.sendSMSMessageTwillo(phone_number);

      const data = await this._service.updateUsers({ user_id,name,username,confPassword , email,address, password,as,role_id,phone_number});

      const response = h.response({
        status: "success",
        message: "User berhasil diupdate",
        data: {
          user_id,
        },
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

  async getUserAllHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,[""])



      const { page,size,search,role_id } = request.query;

      const user = await this._service.getUserAll(page,size,search,role_id );

      return {
        status: "success",
        data: {
          user,
        },
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

  async getUserProfileHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;
      const user_id = decodeJwt.id;

      // await permissionsHelper.cekPermission(decode_role_id,["can_all_operate_job","can_create_job"])


      const user = await this._service.getProfile(decodeJwt);

      return {
        status: "success",
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
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

  async getUserByIdHandler(request, h) {
    try {
      const header = request.headers.authorization;
      const decodeJwt = decodeJWTHelper.decode(header);
      const decode_role_id = decodeJwt.role_id;

      await permissionsHelper.cekPermission(decode_role_id,[""])



      const { user_id } = request.params;

      const user = await this._service.getUserByid(user_id);

      return {
        status: "success",
        data: {
          user,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
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

module.exports = UsersHandler;
