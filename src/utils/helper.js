import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Get all key that you want to exclude
 * @param {*} obj Object from where you want to remove felid
 * @param {object} options Can be include, exclude, isDefault
 * @param {*} options.include Key(s) that you don't want to remove from default
 * @param {*} options.exclude Key(s) that you want to remove
 * @param {boolean} options.isDefault If false then it will no remove default fields value
 * @return array of keys
 */
const getExcludeKeys = (options = {}) => {
	const basicFields = ['createdAt', 'updatedAt', 'deletedAt', 'deletedBy', 'createdBy', 'updatedBy', 'isDeleted', 'password', '__v'];

	if (options?.include) {
		let includeKeys = options.include;
		includeKeys = typeof includeKeys === 'string' ? [includeKeys] : includeKeys || [];
		includeKeys.forEach(key => {
			const index = basicFields.indexOf(key);
			if (index > -1) basicFields.splice(index, 1);
		});
	}

	let keys = typeof options?.exclude === 'string' ? [options?.exclude] : options?.exclude || [];
	if (!Object.hasOwnProperty.call(options, 'isDefault') || options.isDefault === true) keys = keys.concat(basicFields);
	return keys;
};

/**
 * Get length of string, array or number of keys in object
 * @param {*} params can be string, array or object
 * @returns length of string, array or number of keys in object
 */
export const getLength = params => {
	if (Array.isArray(params) || typeof params === 'string') {
		return params.length;
	}
	if (params instanceof Object) {
		return Object.keys(params).length;
	}
	return false;
};

/**
 * Check params env is current environment of node application
 * @param {String} env pass node environment name
 * @returns true or false
 */
export const isNodeEnv = (env = []) => {
	env = typeof env === 'string' ? [env] : env;
	return env.includes(process.env.NODE_ENV);
};

/**
 * This function uses recursion to filter null, undefined or empty string values items from nested objects.
 * @param {*} data It can be array or object
 * @param {boolean} isNested true if you want to clean in nested level else it will clean only top level
 * @returns clean object without null, undefined or empty string
 */
export const cleanEmpty = (data, isNested = false) => {
	if (!isNested) {
		return Object.fromEntries(
			Object.entries(data).filter(([_, value]) => {
				return value != null && value !== '' && !(Array.isArray(value) && value.length === 0);
			})
		);
	}
	if (Array.isArray(data)) {
		return data.map(value => (value && typeof value === 'object' ? this.cleanEmpty(value) : value)).filter(value => value != null && value !== '');
	}
	return Object.fromEntries(
		Object.entries(data)
			.filter(([_, value]) => value != null && value !== '')
			.map(([key, value]) => [key, value === Object(value) && !mongoose.isValidObjectId(value) ? this.cleanEmpty(value) : value])
	);
};

/**
 * Remove unwanted fields from object
 * @param {*} obj Object from where you want to remove felid
 * @param {object} options Can be include, exclude, isDefault
 * @param {*} options.include Key(s) that you don't want to remove from default
 * @param {*} options.exclude Key(s) that you want to remove
 * @param {boolean} options.isDefault If false then it will no remove default fields value
 * @return Object with removed field
 */
export const removeFields = (obj, options = {}) => {
	const keys = getExcludeKeys(options);
	keys.forEach(key => delete obj[key]);
	return obj;
};

/**
 * Exclude unwanted fields from database
 * @param {*} obj Object from where you want to remove felid
 * @param {object} options Can be include, exclude, isDefault
 * @param {*} options.include Key(s) that you don't want to remove from default
 * @param {*} options.exclude Key(s) that you want to remove
 * @param {boolean} options.isDefault If false then it will no remove default fields value
 * @return exclude string for mongodb
 */
export const deselectFields = (options = {}) => {
	const keys = getExcludeKeys(options);
	if (keys?.length > 0 && keys[0] != null && keys[0] !== '') {
		const result = keys.reduce((result, key) => {
			result[key] = false;
			return result;
		}, {});
		return result;
	}
};

/**
 * Synchronously generates a hash for the given string.
 * @param {*} str String to hash
 * @return Resulting hash
 */
export function genBcryptHash(str) {
	return bcrypt.hashSync(str, bcrypt.genSaltSync(process.env.BCRYPT_SALT_ROUNDS || 10));
}

/**
 *
 * @param {Object} params
 * @param {Object} params.page
 * @param {Object} params.perPage
 * @param {Object} params.isAscending
 * @param {Object} params.orderBy
 * @returns
 */
export const pagination = params => {
	const response = {};
	const { page = 1, perPage = 15, isAscending = false, orderBy } = params || {};

	const order = isAscending ? 1 : -1;

	if (orderBy) response.sort = { [orderBy]: order };
	else response.sort = { _id: order };

	response.page = +page;

	response.limit = +perPage;
	response.skip = (+page - 1) * response.limit || 0;

	return response;
};
