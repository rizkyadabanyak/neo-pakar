const InvariantError = require("../../exceptions/InvariantError");
const { CompanyDetailPayloadSchema,CandidateDetailAddSkillPayloadSchema } = require("./schema");

const CompanyDetailValidator = {
  validateCompanyDetailPayload: (payload) => {
    const validationResult = CompanyDetailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = CompanyDetailValidator;
