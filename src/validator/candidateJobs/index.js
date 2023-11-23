const InvariantError = require("../../exceptions/InvariantError");
const { AcceptApplicationPayloadSchema } = require("./schema");

const AcceptApplicationValidator = {
  validateAcceptApplicationPayload: (payload) => {
    const validationResult = AcceptApplicationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = AcceptApplicationValidator;
