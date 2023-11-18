const InvariantError = require("../../exceptions/InvariantError");
const { CompanyDetailPayloadSchema,CandidateDetailAddSkillPayloadSchema } = require("./schema");

const CandidateDetailValidator = {
  validateCompanyDetailPayload: (payload) => {
    const validationResult = CompanyDetailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = CandidateDetailValidator;
