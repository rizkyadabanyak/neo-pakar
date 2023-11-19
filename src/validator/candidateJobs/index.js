const InvariantError = require("../../exceptions/InvariantError");
const { CandidateJobsPayloadSchema,CandidateDetailAddSkillPayloadSchema } = require("./schema");

const CandidateJobsValidator = {
  validateCandidateJobsPayload: (payload) => {
    const validationResult = CandidateJobsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = CandidateJobsValidator;
