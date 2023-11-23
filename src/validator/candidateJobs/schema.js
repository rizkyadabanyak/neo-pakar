const Joi = require("joi");

const AcceptApplicationPayloadSchema = Joi.object({
    candidate_job_id: Joi.required(),
    status: Joi.string()
        .required(),
});


module.exports = { AcceptApplicationPayloadSchema };
