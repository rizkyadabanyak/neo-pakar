const ClientError = require("./ClientError");

class Forbidden  extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = "Forbidden ";
  }
}

module.exports = Forbidden;
