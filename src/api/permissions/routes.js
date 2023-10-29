const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/permissions/store",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storePermissionHandler,
    },
    {
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
