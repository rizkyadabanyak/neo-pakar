const SkillsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "skills",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const skillsHandler = new SkillsHandler(service, validator);
    server.route(routes(skillsHandler));
  },
};
