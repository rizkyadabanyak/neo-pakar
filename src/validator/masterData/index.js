const InvariantError = require("../../exceptions/InvariantError");
const { masterDataPayloadSchema } = require("./schema");

const masterDataValidator = {
  validateMasterDataPayload: (payload) => {
    const validationResult = masterDataPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = masterDataValidator;
