import mongoose from 'mongoose';
import Joi from 'joi';

export const mongoId = (value, helpers) => {
	if (!mongoose.Types.ObjectId.isValid(value)) {
		return helpers.message('Invalid id');
	}
	return value;
};

export const pagination = (orderBy = ['_id', 'createdAt']) => {
	return {
		orderBy: Joi.string().valid(...orderBy),
		isAscending: Joi.boolean(),
		page: Joi.number().min(1),
		perPage: Joi.number().min(1),
	};
};
