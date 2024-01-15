import express from 'express';

import validate from '../../middlewares/validate.js';

import { userValidation } from '../../validations/index.validation.js';
import { userController } from '../../controllers/v1/index.controller.js';

const router = express.Router();

router.get('/', validate(userValidation.getUsers), userController.getUsers);

router.get('/:id', validate(userValidation.getUser), userController.getUser);

router.post('/', validate(userValidation.createUser), userController.createUser);

router.patch('/:id', validate(userValidation.updateUser), userController.updateUser);

router.delete('/:id', validate(userValidation.deleteUser), userController.deleteUser);

export default router;
