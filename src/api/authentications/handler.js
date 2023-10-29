const ClientError = require("../../exceptions/ClientError");
const { jwtDecode } = require("jwt-decode");

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.registerUserCompanyHandler = this.registerUserCompanyHandler.bind(this);
    this.loginAuthenticationHandler = this.loginAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }


  async registerUserCompanyHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);

      // return h.response({
      //   status: request.payload,
      // });

      const { name,username,confPassword , email,address, password } = request.payload;

      const userId = await this._usersService.addUserCompany({ name,username,confPassword , email,address, password });

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


  async loginAuthenticationHandler(request, h) {
    try {


      // console.log('sini');

      this._validator.validatePostAuthenticationPayload(request.payload);
      // return h.response({
      //   status: request.payload,
      // });
      const { username, password } = request.payload;

      const data = await this._usersService.verifyUserCredential(username, password);

      const id = data.id;
      const name = data.name;
      const email = data.email;
      const username_as = data.username;
      const role = data.role.name;
      const role_id = data.role.id;
      const as = role;


      // const expiresIn = 3600; // Contoh: token berlaku selama 1 jam
      const expiresIn = parseInt(process.env.TIME_JWT);

      const paylod = {
        id, name, email,as,role_id,username_as,exp: Math.floor(Date.now() / 1000) + expiresIn
      };

      const accessToken = this._tokenManager.generateAccessToken(paylod);
      const refreshToken = this._tokenManager.generateRefreshToken(paylod);


      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: "success",
        message: "Anda berhasil login",
        data: {
          login_as : as,
          accessToken,
          refreshToken,
        },
      });

      response.code(201);
      return response;
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

  async putAuthenticationHandler(request, h) {
    try {
      const { refreshToken } = request.payload;

      // const header = request.headers.authorization;
      //
      // const arrayHeader = header.split(" ");
      // const decoded = jwtDecode(arrayHeader[1]);
      //
      // const role = decoded.as;

      this._validator.validatePutAuthenticationPayload(request.payload);

      // const expiresIn = 3600; // Contoh: token berlaku selama 1 jam
      const expiresIn = parseInt(process.env.TIME_JWT);
      let exp = Math.floor(Date.now() / 1000) + expiresIn;

      await this._authenticationsService.verifyRefreshToken(refreshToken);

      const data = this._tokenManager.verifyRefreshToken(refreshToken);

      const id = data.id;
      const name = data.name;
      const email = data.email;
      const username_as = data.username_as;
      const as = data.as;
      const role_id = data.role_id;


      const paylod = {
        id, name, email,as,role_id,username_as,exp
      };

      const accessToken = this._tokenManager.generateAccessToken(paylod);

      return {
        status: "success",
        message: "Access Token berhasil diperbarui",
        data: {
          accessToken,
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

  async deleteAuthenticationHandler(request, h) {
    try {
      this._validator.validateDeleteAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: "success",
        message: "Refresh token berhasil dihapus",
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

module.exports = AuthenticationsHandler;
