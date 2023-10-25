const Joi = require("joi");

const CandidatePayloadSchema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required(),
  password: Joi.string()
      .required(),
  name: Joi.string()
      .required(),
  address: Joi.string()
      .required(),
  confPassword: Joi.ref(  "password"),
  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
      .required(),
  phone_number : Joi.number()
      .required(),
}).with('password', 'confPassword');

module.exports = { CandidatePayloadSchema };
