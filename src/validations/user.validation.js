import Joi from 'joi';

import { mongoId, pagination } from './custom.validation.js';
import { GENDER } from '../constant/enum.js';

const objectId = Joi.string().custom(mongoId);

export const getUsers = {
	query: Joi.object().keys({
		...pagination(['_id', 'firstName', 'lastName', 'email', 'gender', 'createdAt']),
		search: Joi.string(),
	}),
};

export const getUser = {
	params: Joi.object({
		id: objectId.required(),
	}),
};

export const createUser = {
	body: Joi.object({
		firstName: Joi.string().min(3).required(),
		lastName: Joi.string().min(3),
		email: Joi.string().min(10).email().required(),
		phone: Joi.string()
			.length(10)
			.pattern(/^\d+$/)
			.messages({
				'string.pattern.base': `Phone number must have 10 digits.`,
			})
			.required(),
		gender: Joi.string()
			.valid(...Object.values(GENDER))
			.required(),
		address: Joi.string().max(100),
	}),
};

export const updateUser = {
	params: Joi.object({
		id: objectId.required(),
	}),
	body: Joi.object({
		firstName: Joi.string().min(3),
		lastName: Joi.string().min(3),
		email: Joi.string().min(10).email(),
		phone: Joi.string().length(10).pattern(/^\d+$/).messages({
			'string.pattern.base': `Phone number must have 10 digits.`,
		}),
		gender: Joi.string().valid(...Object.values(GENDER)),
		address: Joi.string().max(100),
	})
		.required()
		.not({}),
};

export const deleteUser = {
	params: Joi.object({
		id: objectId.required(),
	}),
};
