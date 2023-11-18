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
      handler: handler.getCandidateDetailHandler,
    },
  ];
};

module.exports = routes;
