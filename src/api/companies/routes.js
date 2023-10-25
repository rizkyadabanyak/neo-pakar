const routes = (handler) => [
  {
    method: "POST",
    path: "/companies",
    config: {
      auth: false,
      payload: {
        parse: true,
        allow: 'multipart/form-data',
        multipart: { output: 'stream' },
      }
    },
    handler: handler.postCompanyHandler,
  },{
    method: "GET",
    path: "/companies/get",
    config: {
      auth: "company_jwt",
    },
    handler: handler.getAllCompany,
  },

];

module.exports = routes;
