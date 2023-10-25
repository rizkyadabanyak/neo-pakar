const routes = (handler) => [
  {
    method: "POST",
    path: "/candidate/login",
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
    path: "/candidate/register",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.registerCandidateHandler,
  },
];

module.exports = routes;
