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
    path: "/users/register/company",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.registerUserCompanyHandler,
  },
  {
    method: "PUT",
    path: "/updatedToken",
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
    path: "/authentications",
    handler: handler.deleteAuthenticationHandler,
  },
];

module.exports = routes;
