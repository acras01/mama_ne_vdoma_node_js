import * as Joi from 'joi';

export interface IEnv {
  MONGO_URL: string;
  JWT_SECRET: string;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  RESET_TOKEN_TTL: number;
  BB2_SECRET_KEY: string;
  BB2_SECRET_KEY_NAME: string;
  BB2_FILES_BUCKET_ID: string;
  SESSION_SECRET: string;
  GLOBAL_PREFIX: string;
  REDIS_PASSWORD: string;
}

const baseString = Joi.string().required().exist();
const baseNumber = Joi.number().required().exist();

export const envValidationSchea = Joi.object<IEnv>({
  MONGO_URL: baseString,
  JWT_SECRET: baseString,
  SMTP_USER: baseString,
  SMTP_PASSWORD: baseString,
  RESET_TOKEN_TTL: baseNumber,
  BB2_SECRET_KEY: baseString,
  BB2_SECRET_KEY_NAME: baseString,
  BB2_FILES_BUCKET_ID: baseString,
  SESSION_SECRET: baseString,
  GLOBAL_PREFIX: baseString,
  REDIS_PASSWORD: baseString,
});
