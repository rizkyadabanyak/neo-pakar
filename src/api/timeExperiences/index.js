const TimeExperiencesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "timeExperiences",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const timeExperiencesHandler = new TimeExperiencesHandler(service, validator);
    server.route(routes(timeExperiencesHandler));
  },
};
