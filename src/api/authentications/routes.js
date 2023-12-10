const Path = require('path');
const routes = (handler) => [
  {
    method: "POST",
    path: "/users/login",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.loginAuthenticationHandler,
  },
  {
    method: "POST",
    path: "/users/register",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.registerUserHandler,
  },
  {
    method: "PUT",
    path: "/users/updatedToken",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.putAuthenticationHandler,
  },
  {
    method: "DELETE",
    path: "/users/logout",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.deleteAuthenticationHandler,
  },
  {
    method: "GET",
    path: '/images/{file_path*}',  // The route parameter * allows for nested paths
    handler: handler.fileHandler,
  },
  {
    method: "GET",
    path: '/testNO',  // The route parameter * allows for nested paths
    handler: handler.sendEmailSubcriptionSNS,
  },
];

module.exports = routes;
