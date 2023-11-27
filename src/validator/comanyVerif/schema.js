const Joi = require("joi");

const CompanyVerifPayloadSchema = Joi.object({

  status: Joi.bool()
      .required(),
});



module.exports = { CompanyVerifPayloadSchema };
