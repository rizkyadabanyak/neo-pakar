const Joi = require("joi");

const CompanyDetailPayloadSchema = Joi.object({

  address: Joi.string()
      .required(),
  phone_number: Joi.number()
      .required(),
  about_company: Joi.string(),
  logo_company: Joi.any()
});



module.exports = { CompanyDetailPayloadSchema };
