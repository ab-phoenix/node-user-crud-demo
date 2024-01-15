// import { hostAddress } from '../config/index.js';

import info from './info.js';
import tags from './tags.js';
import securityDefinitions from './securityDefinitions.js';

import { successResponse, errorResponse } from './definitions/common.js';

import { userPath } from './path/index.js';

const path = {
	'/user': { get: userPath.getUsers, post: userPath.createUser },
	'/user/{id}': { get: userPath.getUser, patch: userPath.updateUser, delete: userPath.deleteUser },
	'/user/{id}/upload-image': { patch: userPath.uploadImage },
};

export default {
	openapi: '3.0.0',
	info,
	servers: [
		{
			url: `http://localhost:3000/{basePath}`,
			description: 'Local server',
			variables: {
				basePath: { default: 'api/v1', enum: ['api/v1'] },
			},
		},
	],
	tags,
	components: {
		securitySchemes: securityDefinitions,
		schemas: {
			successResponse,
			errorResponse,
		},
	},
	security: [
		{
			bearerAuth: [],
		},
	],
	schemas: ['http', 'https'],
	paths: { ...path },
};
