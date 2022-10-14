import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  STAGE: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.required(),
  DB_PASSWORD: Joi.required(),
  DB_DATABASE: Joi.required(),
  JWT_SECRET: Joi.required(),
  DB_URL: Joi.required(),
});
