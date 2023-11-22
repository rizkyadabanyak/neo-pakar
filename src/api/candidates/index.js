const CandidatesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "candidates",
  version: "1.0.0",
  register: async (server, { service }) => {
    const candidatesHandler = new CandidatesHandler(service);
    server.route(routes(candidatesHandler));
  },
};
