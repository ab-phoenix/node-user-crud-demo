import app from './app.js';
import { port } from './src/config/index.js';
import logger from './src/config/logger.js';
import * as DATABASE from './src/config/database.js';

let server;

const projectName = `
██╗   ██╗███████╗███████╗██████╗        ██████╗██████╗ ██╗   ██╗██████╗       ██████╗ ███████╗███╗   ███╗ ██████╗
██║   ██║██╔════╝██╔════╝██╔══██╗      ██╔════╝██╔══██╗██║   ██║██╔══██╗      ██╔══██╗██╔════╝████╗ ████║██╔═══██╗
██║   ██║███████╗█████╗  ██████╔╝█████╗██║     ██████╔╝██║   ██║██║  ██║█████╗██║  ██║█████╗  ██╔████╔██║██║   ██║
██║   ██║╚════██║██╔══╝  ██╔══██╗╚════╝██║     ██╔══██╗██║   ██║██║  ██║╚════╝██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║
╚██████╔╝███████║███████╗██║  ██║      ╚██████╗██║  ██║╚██████╔╝██████╔╝      ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝       ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝       ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝
`;

DATABASE.connect()
	.then(async () => {
		console.info(projectName);

		logger.info('Connected to database');

		server = app.listen(port, () => {
			logger.info(`Listening to port ${port}`);
		});
	})
	.catch(err => {
		logger.error(err);
	});

const exitHandler = () => {
	if (!server) process.exit(1);
	server.close(() => {
		logger.info('Server closed');
		process.exit(1);
	});
};

const unexpectedErrorHandler = error => {
	logger.error(error);
	exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});
