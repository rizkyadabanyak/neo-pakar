const PermissionsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "permissions",
  version: "1.0.0",
  register: async (server, { service, validator }) => {
    const permissionsHandler = new PermissionsHandler(service, validator);
    server.route(routes(permissionsHandler));
  },
};
