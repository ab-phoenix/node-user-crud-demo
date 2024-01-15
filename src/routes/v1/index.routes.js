import express from 'express';
import swaggerUi from 'swagger-ui-express';

import apiSwaggerDoc from '../../docs/swagger/index.js';

import user from './user.route.js';

const router = express.Router();

const swaggerUiOpts = { swaggerOptions: { docExpansion: 'none' } };
const swaggerHtml = swaggerUi.generateHTML(apiSwaggerDoc, swaggerUiOpts);

router.use('/doc', swaggerUi.serveFiles(apiSwaggerDoc, swaggerUiOpts));
router.get('/doc', (req, res) => res.send(swaggerHtml));

router.use('/user', user);

export default router;
