import { successResponse, errorResponse, paginationParams } from '../definitions/common.js';
import { GENDER } from '../../../constant/enum.js';

export const getUsers = {
	tags: ['User'],
	summary: 'Get users',
	parameters: [
		...paginationParams(['_id', 'firstName', 'lastName', 'email', 'gender', 'createdAt']),
		{
			name: 'search',
			in: 'query',
			schema: {
				type: 'string',
			},
		},
	],
	produces: ['application/json'],
	security: [],
	responses: {
		200: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							statusCode: { type: 'number' },
							status: { type: 'boolean' },
							page: { type: 'number' },
							total: { type: 'number' },
							data: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										_id: { type: 'string' },
										firstName: { type: 'string' },
										lastName: { type: 'string' },
										email: { type: 'string' },
										phone: { type: 'string' },
										gender: { type: 'string' },
										address: { type: 'string' },
										createdAt: { type: 'string', format: 'date-time' },
									},
								},
							},
						},
					},
				},
			},
		},
		Error: { content: { 'application/json': { schema: errorResponse } } },
	},
};

export const getUser = {
	tags: ['User'],
	summary: 'Get user',
	security: [],
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'User id',
			required: true,
			schema: { type: 'string' },
		},
	],
	produces: ['application/json'],
	responses: {
		200: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							statusCode: { type: 'number' },
							status: { type: 'boolean' },
							data: {
								type: 'object',
								properties: {
									_id: { type: 'string' },
									firstName: { type: 'string' },
									lastName: { type: 'string' },
									email: { type: 'string' },
									phone: { type: 'string' },
									gender: { type: 'string' },
									address: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
		Error: { content: { 'application/json': { schema: errorResponse } } },
	},
};

export const createUser = {
	tags: ['User'],
	summary: 'Create user',
	security: [],
	produces: ['application/json'],
	requestBody: {
		content: {
			'application/json': {
				schema: {
					type: 'object',
					required: ['firstName', 'email', 'phone', 'gender'],
					properties: {
						firstName: { type: 'string', min: 3 },
						lastName: { type: 'string', min: 3 },
						email: { type: 'string', format: 'email', min: 10 },
						phone: { type: 'number', length: 10 },
						gender: { type: 'string', enums: Object.values(GENDER) },
						address: { type: 'string', max: 100 },
					},
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							statusCode: { type: 'number' },
							status: { type: 'boolean' },
							message: { type: 'string' },
							data: {
								type: 'object',
								properties: {
									_id: { type: 'string' },
									firstName: { type: 'string' },
									lastName: { type: 'string' },
									email: { type: 'string' },
									phone: { type: 'string' },
									gender: { type: 'string' },
									address: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
		Error: { content: { 'application/json': { schema: errorResponse } } },
	},
};

export const updateUser = {
	tags: ['User'],
	summary: 'Update user',
	security: [],
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'User id',
			required: true,
			schema: { type: 'string' },
		},
	],
	produces: ['application/json'],
	requestBody: {
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						firstName: { type: 'string', min: 3 },
						lastName: { type: 'string', min: 3 },
						email: { type: 'string', format: 'email', min: 10 },
						phone: { type: 'number', length: 10 },
						gender: { type: 'string', enums: Object.values(GENDER) },
						address: { type: 'string', max: 100 },
					},
				},
			},
		},
	},
	responses: {
		200: {
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							statusCode: { type: 'number' },
							status: { type: 'boolean' },
							message: { type: 'string' },
							data: {
								type: 'object',
								properties: {
									_id: { type: 'string' },
									firstName: { type: 'string' },
									lastName: { type: 'string' },
									email: { type: 'string' },
									phone: { type: 'string' },
									gender: { type: 'string' },
									address: { type: 'string' },
								},
							},
						},
					},
				},
			},
		},
		Error: { content: { 'application/json': { schema: errorResponse } } },
	},
};

export const deleteUser = {
	tags: ['User'],
	summary: 'Delete user',
	security: [],
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'User id',
			required: true,
			schema: { type: 'string' },
		},
	],
	produces: ['application/json'],
	responses: {
		200: { content: { 'application/json': { schema: successResponse } } },
		Error: { content: { 'application/json': { schema: errorResponse } } },
	},
};
