const Joi = require("joi");

const masterDataPayloadSchema = Joi.object({

  name: Joi.string()
      .required(),
  description: Joi.string()
      .required(),
});

module.exports = { masterDataPayloadSchema };
