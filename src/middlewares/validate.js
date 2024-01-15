import Joi from 'joi';

import { pick } from '../utils/pick.js';
import APIError from '../utils/APIError.js';

const validate = schema => (req, res, next) => {
	const validSchema = pick(schema, ['params', 'query', 'body']);
	const object = pick(req, Object.keys(validSchema));
	const { value, error } = Joi.compile(validSchema)
		.prefs({ errors: { label: 'key' }, abortEarly: false })
		.validate(object);

	if (error) {
		const errorMessage = error.details
			.map(details => {
				let { message } = details;
				const { type, context } = details;

				if (type === 'alternatives.match') {
					message = context.details.map(ele => ele.message).join(', ');
				}
				return message;
			})
			.join(', ');

		return next(new APIError({ status: 422, message: errorMessage }));
	}

	Object.assign(req, value);
	return next();
};

export default validate;
