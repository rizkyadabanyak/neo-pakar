const routes = (handler) => [
  {
    method: "POST",
    path: "/users",
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
    method: "PUT",
    path: "/users/{user_id}",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.updateUserHandler,
  },
  {
    method: "GET",
    path: "/users",
    config: {
      auth: "user_jwt",
    },
    handler: handler.getUserAllHandler,
  },
  {
    method: "GET",
    path: "/users/profile",
    config: {
      auth: "user_jwt",
    },
    handler: handler.getUserProfileHandler,
  },

];

module.exports = routes;
