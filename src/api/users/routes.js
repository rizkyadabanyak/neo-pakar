const routes = (handler) => [
  {
    method: "POST",
    path: "/users/store",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.postUserHandler,
  },
  {
    method: "GET",
    path: "/users/getAll",
    config: {
      auth: "user_jwt",
    },
    handler: handler.getUserAllHandler,
  },
  {
    method: "GET",
    path: "/users/{id}",
    handler: handler.getUserByIdHandler,
  },
  {
    method: "GET",
    path: "/users",
    handler: handler.getUsersByUsernameHandler,
  },
];

module.exports = routes;
