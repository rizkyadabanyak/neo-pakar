const CompaniesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "companies",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const companiesHandler = new CompaniesHandler(service, validator);
    server.route(routes(companiesHandler));
  },
};
