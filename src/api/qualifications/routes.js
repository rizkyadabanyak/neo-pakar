const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/qualifications",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeQualificationHandler,
    },{
      method: "PUT",
      path: "/qualifications/{qualification_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateQualificationHandler,
    },{
      method: "GET",
      path: "/qualifications/{qualification_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getQualificationByIdHandler,
    },{
      method: "DELETE",
      path: "/qualifications/{qualification_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/qualifications",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllQualificationHandler,
    },
  ];
};

module.exports = routes;