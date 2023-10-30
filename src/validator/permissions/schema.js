const Joi = require("joi");

const PermissionPayloadSchema = Joi.object({

  role_id: Joi.string()
      .required(),
  access: Joi.string()
      .required(),

});

module.exports = { PermissionPayloadSchema };
