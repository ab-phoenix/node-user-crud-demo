import { cleanEmpty, getLength } from '../utils/helper.js';

/**
 * Custom response method
 * @param {*} options params that we want to send as response
 * @param {*} options.status true if api is successfully return value else false
 * @param {*} options.message api response message
 * @param {*} options.data api response data
 * @param {*} options.page page number for pagination
 * @param {*} options.total total number of records
 * @returns {import('express').Response}
 */
export default function sendJson(options = {}) {
	if (typeof options !== 'object') throw new Error('response params must be an object');

	const { statusCode = 200, message = '', data = [], page = null, total = null, isAllowEmpty, ...remainingOptions } = options;

	if (page && typeof page !== 'number') throw new Error('page must be a number');
	if (total && typeof total !== 'number') throw new Error('total must be a number');

	const status = !!(statusCode >= 200 && statusCode < 300);

	const response = cleanEmpty({ statusCode, status, message, page, total, ...remainingOptions });

	if (getLength(data) || /GET/i.test(this.req.method) || isAllowEmpty) response.data = data;

	return this.status(statusCode).json(response);
}
