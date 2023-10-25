const routes = (handler) => [
  {
    method: "GET",
    path: "/companies/get",
    config: {
      auth: "company_jwt",
    },
    handler: handler.getAllCompany,
  },

];

module.exports = routes;
