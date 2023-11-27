const routes = (handler) => {
  return [

    {
      method: "PUT",
      path: "/companyVerif/{username}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.newCompanySetVerifHandler,
    },{
      method: "GET",
      path: "/companyVerif/{username}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getNewCompanyByUsernameHandler,
    },{
      method: "GET",
      path: "/companyVerif",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getNewCompanyHandler,
    },
  ];
};

module.exports = routes;
