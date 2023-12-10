const routes = (handler) => {
  return [

    {
      method: "POST",
      path: "/companyDetail",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updatecompanyDetailHandler,
    },{
      method: "GET",
      path: "/companyDetail",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getCompanyDetailHandler,
    },{
      method: "GET",
      path: "/companyDetail/getCountJob",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getCountJobHandler,
    },
  ];
};

module.exports = routes;
