const InvariantError = require("../../exceptions/InvariantError");
const { PermissionPayloadSchema } = require("./schema");

const PermissionsValidator = {
  validatePermissionPayload: (payload) => {
    const validationResult = PermissionPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PermissionsValidator;
