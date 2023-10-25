const AuthenticationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authenticationCandidate",
  version: "1.0.0",
  register: async (server, {
    authenticationsServiceCandidate,
    candidatesService,
    tokenManager,
    validator,
  }) => {
    const authenticationsHandler = new AuthenticationsHandler(
        authenticationsServiceCandidate,
        candidatesService,
        tokenManager,
        validator,
    );
    server.route(routes(authenticationsHandler));
  },
};
