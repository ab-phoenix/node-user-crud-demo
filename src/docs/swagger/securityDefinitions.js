const securityDefinitions = {
	bearerAuth: {
		type: 'http',
		scheme: 'bearer',
		bearerFormat: 'JWT',
	},
};

export default securityDefinitions;
