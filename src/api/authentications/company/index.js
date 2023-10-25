const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authenticationCompanies",
  version: "1.0.0",
  register: async (server, {
    authenticationsServiceCompany,
    companiesService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
        authenticationsServiceCompany,
        companiesService,
        tokenManager,
        validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
