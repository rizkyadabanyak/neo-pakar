const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/roles",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeRoleHandler,
    },{
      method: "PUT",
      path: "/roles/{role_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateRoleHandler,
    },{
      method: "GET",
      path: "/roles/{role_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getRoleByIdHandler,
    },{
      method: "DELETE",
      path: "/roles/{role_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },
    {
      method: "GET",
      path: "/roles",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllRoleHandler,
    },
    {
      method: "GET",
      path: "/roles/getAllData/noAuth",
      config: {
        auth: false,
      },
      handler: handler.getAllRoleNoAuthHandler,
    },
  ];
};

module.exports = routes;
