const CandidateDetailHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "candidateDetail",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const candidateDetailHandler = new CandidateDetailHandler(service, validator);
    server.route(routes(candidateDetailHandler));
  },
};
