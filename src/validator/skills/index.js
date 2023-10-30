const InvariantError = require("../../exceptions/InvariantError");
const { SkillsPayloadSchema } = require("./schema");

const SkillsValidator = {
  validateSkillsPayload: (payload) => {
    const validationResult = SkillsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SkillsValidator;
