const CareerLevelsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "careerLevels",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const careerLevelsHandler = new CareerLevelsHandler(service, validator);
    server.route(routes(careerLevelsHandler));
  },
};
