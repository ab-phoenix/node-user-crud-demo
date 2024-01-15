import mime from 'mime';

import APIError from '../../utils/APIError.js';
import { deselectFields, formatBytes, pagination, removeFields } from '../../utils/helper.js';
import { aggregatePagination } from '../../utils/customPagination.js';
import { uploadFile } from '../../utils/aws-s3.js';

import userModel from '../../models/v1/user.model.js';
import userImageModel from '../../models/v1/user-image.model.js';

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
					$lookup: {
						from: 'userImages',
						localField: 'userImages',
						foreignField: '_id',
						as: 'userImages',
					},
				},
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

export const uploadImage = async (reqParams, files) => {
	try {
		const { id: recordId } = reqParams;

		const result = await userModel.findOne({ _id: recordId, isDeleted: false }, deselectFields());
		if (!result) throw new APIError({ status: 404, message: 'User not found' });

		const userImagePayload = [];

		await Promise.allSettled(
			files.map(async file => {
				const s3Url = await uploadFile(file.buffer, {
					folderPath: `user-images/${recordId}/`,
					fileType: mime.getExtension(file.mimetype),
				});

				if (s3Url) {
					userImagePayload.push({
						user: recordId,
						imageUrl: s3Url,
						fileName: file.originalname,
						fileSize: formatBytes(file.size),
					});
				}
			})
		);

		const userImages = await userImageModel.insertMany(userImageModel);
		const userImageIds = userImages.map(userImage => userImage._id);

		await userModel.updateOne({ _id: recordId }, { $push: { userImages: userImageIds } });

		//
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getUser = async reqParams => {
	try {
		const { id: recordId } = reqParams;

		const result = await userModel.findOne({ _id: recordId, isDeleted: false }, deselectFields()).populate({
			path: 'userImages',
		});
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
