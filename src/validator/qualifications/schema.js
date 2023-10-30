const Joi = require("joi");

const QualificationsPayloadSchema = Joi.object({

  name: Joi.string()
      .required(),
  description: Joi.string()
      .required(),
});

module.exports = { QualificationsPayloadSchema };
