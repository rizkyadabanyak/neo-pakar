const InvariantError = require("../../exceptions/InvariantError");
const { CompanyVerifPayloadSchema } = require("./schema");

const CompanyVerifValidator = {
  validateCompanyVerifPayload: (payload) => {
    const validationResult = CompanyVerifPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

};

module.exports = CompanyVerifValidator;
