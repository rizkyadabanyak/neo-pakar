const CandidateJobsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "candidateJobs",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const candidateJobsHandler = new CandidateJobsHandler(service, validator);
    server.route(routes(candidateJobsHandler));
  },
};
