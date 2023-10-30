const JobTypeWorksHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "jobTypeWorks",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const jobTypeWorksHandler = new JobTypeWorksHandler(service, validator);
    server.route(routes(jobTypeWorksHandler));
  },
};
