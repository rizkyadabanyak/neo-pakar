const ClientError = require("../../exceptions/ClientError");
const { jwtDecode } = require("jwt-decode");
const { SNSClient, PublishCommand,CheckIfPhoneNumberIsOptedOutCommand  } = require('@aws-sdk/client-sns');

const accountSid = 'AC5eeb4158766e7dde48a4954d34266c49';
const authToken = '80196ccdc32a0a4eff26fbb71458fffb';
const client = require('twilio')(accountSid, authToken);


require('dotenv').config();
var AWS = require('aws-sdk');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.registerUserHandler = this.registerUserHandler.bind(this);
    this.loginAuthenticationHandler = this.loginAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
  }

//   async sendSMSMessage(sns, params) {
//     AWS.config.update({
//       region: process.env.REGION,
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY, // AWS access key from environment variables
//         secretAccessKey: process.env.AWS_SECRET_KEY // AWS secret key from environment variables
//       }
//     });
//
// // Create publish parameters
//     var params = {
//       Message: 'xxzcaq', /* required */
//       PhoneNumber: '+62895627543357',
//     };
//
// // Create promise and SNS service object
//     var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
//
// // Handle promise's fulfilled/rejected states
//     publishTextPromise.then(
//         function(data) {
//           console.log("MessageID is " + data.MessageId);
//         }).catch(
//         function(err) {
//           console.error(err, err.stack);
//         });
//   }
  // async sendSMSMessageTwillo(phone_number) {
  //
  //   const randomDigit = Math.floor(10000 + Math.random() * 99999);
  //   // return randomDigit;
  //
  //
  //   // return job;
  //
  //   const removeNOL = phone_number.substring(1);
  //
  //   // return removeNOL;
  //
  //   try {
  //     client.messages
  //         .create({
  //           body: 'your code '+randomDigit,
  //           from: 'whatsapp:+14155238886',
  //           to: 'whatsapp:+62'+ removeNOL
  //         });
  //
  //     return {
  //       message : 'success send otp',
  //       status : "success",
  //       statusCode : 200
  //
  //     }
  //
  //   } catch (error) {
  //
  //     console.log(error);
  //     return{
  //       message : error,
  //       data : null,
  //       status : "danger",
  //       statusCode : 400
  //
  //     }
  //   }
  //
  // }
  async fileHandler(request, h) {
    try {
      // const { role_id } = request.params;
      // return h.response(
      //     request.params.file_path
      // )
      return  h.file("./"+request.params.file_path);

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

  async registerUserHandler(request, h) {
    try {

      this._validator.validateUserPayload(request.payload);

      const { name,username,confPassword , email,address, password,phone_number,as,role_id } = request.payload;

      // this.sendSMSMessageTwillo(phone_number);

      const data = await this._usersService.addUser({ name,username,confPassword , email,address, password,as,role_id,phone_number});

      const response = h.response({
        status: "success",
        message: "User berhasil ditambahkan",
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

      response.code(200);
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
