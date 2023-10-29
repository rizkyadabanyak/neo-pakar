const InvariantError = require("../../exceptions/InvariantError");
const { RolesPayloadSchema } = require("./schema");

const RolesValidator = {
  validateRolesPayload: (payload) => {
    const validationResult = RolesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = RolesValidator;
