import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'staging', 'development', 'test', 'local'),
		PORT: Joi.number().default(3000),

		BCRYPT_SALT_ROUNDS: Joi.string(),
		DB_URI: Joi.string(),
	})
	.unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

export const version = envVars.version || 'v1';

export const nodeEnv = envVars.NODE_ENV;

export const port = envVars.PORT || 5000;

export const dbConfig = Object.freeze({
	uri: envVars.DB_URI,
	options: {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
});
