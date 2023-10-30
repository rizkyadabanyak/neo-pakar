const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/permissions/setRole/{role_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.setRolePermissionHandler,
    },{
      method: "GET",
      path: "/permissions/getPermissionOnRole",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getPermissionOnRoleHandler,
    },{
      method: "GET",
      path: "/permissions/getListPermission",
      config: {
        auth: false,
      },
      handler: handler.getListPermissionHandler,
    },
  ];
};

module.exports = routes;
