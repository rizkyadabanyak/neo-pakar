const InvariantError = require("../../exceptions/InvariantError");
const { QualificationsPayloadSchema } = require("./schema");

const QualificationsValidator = {
  validateQualificationsPayload: (payload) => {
    const validationResult = QualificationsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = QualificationsValidator;
