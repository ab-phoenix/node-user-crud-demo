/* eslint-disable func-names */
import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const UserImageSchema = new Schema(
	{
		user: { type: ObjectId, ref: 'user', required: true },
		imageUrl: { type: String, required: true },
		fileName: { type: String, required: true },
		fileSize: { type: String, default: 0 },
	},
	{
		timestamps: true,
	}
);

export default model('userImage', UserImageSchema, 'userImages');
