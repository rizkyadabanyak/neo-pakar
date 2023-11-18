const CompanyDetailHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "companyDetail",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const companyDetailHandler = new CompanyDetailHandler(service, validator);
    server.route(routes(companyDetailHandler));
  },
};
