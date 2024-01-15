/* eslint-disable func-names */
import mongoose from 'mongoose';
import { GENDER } from '../../constant/enum.js';

const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const UserSchema = new Schema(
	{
		firstName: { type: String, required: true, min: 3 },
		lastName: { type: String, default: null, min: 3 },

		email: { type: String, required: true, min: 10 },

		phone: { type: String, required: true },

		gender: { type: String, required: true, enums: Object.values(GENDER) },

		address: { type: String, default: null, max: 100 },

		userImages: [{ type: ObjectId, ref: 'userImage', default: null }],

		isDeleted: { type: Boolean, default: false },
		deletedAt: { type: Date, default: null },
	},
	{
		timestamps: true,
	}
);

export default model('user', UserSchema, 'users');
