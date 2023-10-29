const Joi = require("joi");

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const UserPayloadSchema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(5)
      .max(30)
      .required()
      .messages({
        'string.min': `username tidak boleh lebih kecil dari 5 huruf`,
        'string.max': `username tidak boleh lebih besar dari 30 huruf`,
        'string.empty': `username tidak boleh kosong`,
        'any.required': `username tidak boleh kosong`,
      }),
  password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': `password tidak boleh lebih kecil dari 6 huruf`,
        'string.empty': `password tidak boleh kosong`,
        'any.required': `password tidak boleh kosong`,
      }),
  name: Joi.string()
      .required()
      .messages({
        'string.empty': `name tidak boleh kosong`,
        'any.required': `name tidak boleh kosong`,
      }),
  address: Joi.string()
      .required()
      .messages({
        'string.empty': `address tidak boleh kosong`,
        'any.required': `address tidak boleh kosong`,
      }),
  confPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .label('Confirm Password')
      .messages({
        'string.empty': `confPassword tidak boleh kosong`,
        'any.required': `confPassword tidak boleh kosong`,
        'any.only': 'password tidak cocok '
      }),
  email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
      .required()
      .messages({
          'string.empty': `email tidak boleh kosong`,
          'any.required': `email tidak boleh kosong`,
      }),
  phone_number : Joi.number()
      .required()
      .messages({
          'number.base': `phone number hanya boleh angka`,
          'any.required': `phone number tidak boleh kosong`,
      }),
}).with('password', 'confPassword');

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
  UserPayloadSchema
};
