const JobsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "jobs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const jobsHandler = new JobsHandler(service, validator);
    server.route(routes(jobsHandler));
  },
};
