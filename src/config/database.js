import mongoose from 'mongoose';

import { dbConfig } from './index.js';

export const connect = () => {
	try {
		const connection = mongoose.connect(dbConfig.uri, dbConfig.options);
		return Promise.resolve(connection);
	} catch (err) {
		return Promise.reject(err);
	}
};
