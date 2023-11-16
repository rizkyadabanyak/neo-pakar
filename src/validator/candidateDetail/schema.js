const Joi = require("joi");

const CandidateDetailPayloadSchema = Joi.object({

  address: Joi.string()
      .required(),
  phone_number: Joi.number()
      .required(),
  description: Joi.string(),
  image_profile: Joi.any().required(),
  cv_file: Joi.any().required(),
});

module.exports = { CandidateDetailPayloadSchema };
