import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import { nodeEnv } from './src/config/index.js';
import * as morgan from './src/config/morgan.js';
import { errorConverter, errorHandler } from './src/middlewares/error.js';
import APIError from './src/utils/APIError.js';
import Routes from './src/routes/index.routes.js';
import sendJson from './src/middlewares/response.js';

const app = express();

app.response.sendJson = sendJson;

if (nodeEnv !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json({ limit: '100mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.get('/', (req, res, _next) => res.send('Pong'));

// v1 api routes
app.use('/api', Routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new APIError({ status: 404, message: 'Route you are looking for does not exists!' }));
});

// convert error to APIError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
