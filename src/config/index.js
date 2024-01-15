import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envVarsSchema = Joi.object()
	.keys({
		NODE_ENV: Joi.string().valid('production', 'staging', 'development', 'test', 'local'),
		PORT: Joi.number().default(3000),
		DB_URI: Joi.string(),

		AWS_ACCESS_KEY_ID: Joi.string(),
		AWS_SECRET_ACCESS_KEY: Joi.string(),
		AWS_REGION: Joi.string(),
		AWS_BUCKET: Joi.string(),
		AWS_ACL: Joi.string(),
		AWS_BUCKET_URL: Joi.string(),
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

export const awsSecrets = {
	accessKeyId: envVars.AWS_ACCESS_KEY_ID,
	secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
	region: envVars.AWS_REGION,
	s3: {
		bucket: envVars.AWS_BUCKET,
		acl: envVars.AWS_ACL,
		bucketUrl: envVars.AWS_BUCKET_URL,
	},
};
