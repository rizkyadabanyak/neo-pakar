const Joi = require("joi");

const JobsPayloadSchema = Joi.object({
  // company_detail_id: Joi.required(),
  name: Joi.required(),
  job_type_work_id: Joi.required(),
  qualification_id: Joi.required(),
  career_level_id: Joi.required(),
  time_experiences_id: Joi.required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  salary_min: Joi.number(),
  salary_max: Joi.number(),
  description: Joi.string()
      .required(),
  skill: Joi.required(),

});

module.exports = { JobsPayloadSchema };
