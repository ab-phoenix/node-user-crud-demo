import APIError from '../utils/APIError.js';

export const errorConverter = (err, req, res, next) => {
	let error = err;
	if (!(err instanceof APIError)) {
		error = new APIError({ status: err.status, message: err.message, stack: err.stack });
	}
	next(error);
};

export function errorHandler(err, req, res, _next) {
	let message = err.message || 'Something went wrong. Please try again later.';

	if (!err.isPublic) {
		err.status = 500;
		message = 'Something went wrong. Please try again later.';
	}

	if (err.stack) console.error(err.stack);
	if (err.errors) console.error(err.errors);

	req.locals = { errorMessage: message };

	if (err.data) {
		return res.sendJson({ statusCode: err.status, message, data: err.data });
	}

	return res.sendJson({ statusCode: err.status, message });
}
