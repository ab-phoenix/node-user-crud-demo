import morgan from 'morgan';

import { nodeEnv } from './index.js';
import logger from './logger.js';

morgan.token('message', (req, _res, _next) => req?.locals?.errorMessage || '');

const getIpFormat = () => (nodeEnv === 'production' ? ':remote-addr - ' : '');
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
	skip: (req, res) => res.statusCode >= 400,
	stream: { write: message => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
	skip: (req, res) => res.statusCode < 400,
	stream: { write: message => logger.error(message.trim()) },
});
