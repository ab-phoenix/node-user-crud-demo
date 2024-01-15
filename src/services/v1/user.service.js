import APIError from '../../utils/APIError.js';
import { deselectFields, pagination, removeFields } from '../../utils/helper.js';
import { aggregatePagination } from '../../utils/customPagination.js';

import userModel from '../../models/v1/user.model.js';

export const getUsers = async reqQuery => {
	try {
		const query = { isDeleted: false };
		const options = pagination(reqQuery);

		if (reqQuery.search) {
			const searchRegExp = new RegExp(reqQuery.search);
			const searchFields = ['firstName', 'lastName', 'email', 'phone', 'gender'];
			query.$or = searchFields.map(field => ({ [field]: searchRegExp }));
		}

		const response = await aggregatePagination(
			userModel,
			[
				{ $match: query },
				{
					$project: deselectFields({ exclude: ['createdAt'] }),
				},
			],
			options
		);

		return response;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const createUser = async reqBody => {
	try {
		const record = (await userModel.create(reqBody)).toJSON();

		return removeFields(record);
		//
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getUser = async reqParams => {
	try {
		const { id: recordId } = reqParams;

		const result = await userModel.findOne({ _id: recordId, isDeleted: false }, deselectFields());
		if (!result) throw new APIError({ status: 404, message: 'User not found' });

		return result;
	} catch (error) {
		return Promise.reject(error);
	}
};

export const updateUser = async (reqParams, reqBody) => {
	try {
		const { id: recordId } = reqParams;

		const result = await userModel.findOneAndUpdate({ _id: recordId, isDeleted: false }, { $set: reqBody });
		if (!result) throw new APIError({ status: 404, message: 'User not found' });

		//
	} catch (error) {
		return Promise.reject(error);
	}
};

export const deleteUser = async reqParams => {
	try {
		const { id: recordId } = reqParams;

		const result = await userModel.findOneAndUpdate(
			{ _id: recordId, isDeleted: false },
			{
				$set: { isDeleted: true, deletedAt: new Date() },
			}
		);
		if (!result) throw new APIError({ status: 404, message: 'User not found' });

		//
	} catch (error) {
		return Promise.reject(error);
	}
};
