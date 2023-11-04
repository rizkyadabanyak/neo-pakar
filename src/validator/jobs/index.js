const InvariantError = require("../../exceptions/InvariantError");
const { JobsPayloadSchema } = require("./schema");

const SkillsValidator = {
  validateJobsPayload: (payload) => {
    const validationResult = JobsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SkillsValidator;
