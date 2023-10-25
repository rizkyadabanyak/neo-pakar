const Joi = require("joi");

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  confPassword: Joi.string().required(),
  email: Joi.string().required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
