const CompanyVerifHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "companyVerif",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const companyVerifHandler = new CompanyVerifHandler(service, validator);
    server.route(routes(companyVerifHandler));
  },
};
