export const successResponse = Object.freeze({
	type: 'object',
	properties: {
		statusCode: { type: 'number', default: 200 },
		status: { type: 'boolean', default: true },
		message: { type: 'string' },
	},
});

export const errorResponse = Object.freeze({
	type: 'object',
	properties: {
		statusCode: { type: 'number' },
		status: { type: 'boolean', default: false },
		message: { type: 'string' },
	},
});

export const paginationParams = (enums = ['_id', 'createdAt']) => {
	return [
		{
			name: 'orderBy',
			in: 'query',
			schema: {
				type: 'string',
				enum: enums,
			},
			default: 'createdAt',
		},
		{
			name: 'isAscending',
			in: 'query',
			schema: { type: 'boolean' },
			default: false,
		},
		{
			name: 'page',
			in: 'query',
			schema: { type: 'number' },
			default: 1,
		},
		{
			name: 'perPage',
			in: 'query',
			schema: { type: 'number' },
			default: 10,
		},
	];
};
