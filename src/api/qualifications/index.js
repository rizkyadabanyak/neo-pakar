const QualificationsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "qualifications",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const qualificationsHandler = new QualificationsHandler(service, validator);
    server.route(routes(qualificationsHandler));
  },
};
