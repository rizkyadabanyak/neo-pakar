const InvariantError = require("../../exceptions/InvariantError");
const { CandidateDetailPayloadSchema,CandidateDetailAddSkillPayloadSchema } = require("./schema");

const CandidateDetailValidator = {
  validateCandidateDetailPayload: (payload) => {
    const validationResult = CandidateDetailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateCandidateDetailAddSkillPayload: (payload) => {
    const validationResult = CandidateDetailAddSkillPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = CandidateDetailValidator;
