const Joi = require("joi");

const SkillsPayloadSchema = Joi.object({

  name: Joi.string()
      .required(),
  description: Joi.string()
      .required(),
});

module.exports = { SkillsPayloadSchema };
