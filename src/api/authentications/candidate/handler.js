const ClientError = require("../../../exceptions/ClientError");

class AuthenticationsHandler {
  constructor(authenticationsServiceCandidate, candidatesService, tokenManager, validator) {
    this._authenticationsServiceCandidate = authenticationsServiceCandidate;
    this._candidatesService = candidatesService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.loginAuthenticationHandler = this.loginAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    this.registerCandidateHandler = this.registerCandidateHandler.bind(this);
  }

  async registerCandidateHandler(request, h) {
    try {
      const { name,username,confPassword,email,password,address,phone_number  } = request.payload;

      this._validator.validateCandidatePayload(request.payload);

      const id = await this._candidatesService.addCandidate({ name,username,confPassword,email,password,address,phone_number });


      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
        data: {
          id,
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
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;

      const candidate = await this._candidatesService.verifyCandidateCredential(username, password);



      const id= candidate.candidate_id;
      const name = candidate.candidate_name;
      const email = candidate.admin_email;
      const username_as = candidate.candidate_username;
      const as = 'candidate';

      const paylod = {
        id, name, email,as,username_as
      };

      const accessToken = this._tokenManager.generateAccessToken(paylod);
      const refreshToken = this._tokenManager.generateRefreshToken(paylod);

      // return console.log(accessToken);

      await this._authenticationsServiceCandidate.addRefreshToken(id,accessToken,refreshToken);

      const response = h.response({
        status: "success",
        message: "Anda berhasil login",
        data: {
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
      this._validator.validatePutAuthenticationPayload(request.payload);

      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

      const accessToken = this._tokenManager.generateAccessToken({ id });
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
