const Joi = require("joi");

const RolesPayloadSchema = Joi.object({

  name: Joi.string()
      .required(),
  description: Joi.string()
      .required(),
});

module.exports = { RolesPayloadSchema };
