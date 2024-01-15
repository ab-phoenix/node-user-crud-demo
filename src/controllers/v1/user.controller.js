import { userService } from '../../services/v1/index.service.js';

export const getUsers = async (req, res, next) => {
	try {
		const result = await userService.getUsers(req.query);
		return res.sendJson({ ...result });
	} catch (error) {
		return next(error);
	}
};

export const createUser = async (req, res, next) => {
	try {
		const data = await userService.createUser(req.body);
		return res.sendJson({ message: 'User created successfully', data });
	} catch (error) {
		return next(error);
	}
};

export const getUser = async (req, res, next) => {
	try {
		const result = await userService.getUser(req.params);
		return res.sendJson({ data: result });
	} catch (error) {
		return next(error);
	}
};

export const updateUser = async (req, res, next) => {
	try {
		const data = await userService.updateUser(req.params, req.body);
		return res.sendJson({ message: 'User updated successfully', data });
	} catch (error) {
		return next(error);
	}
};

export const deleteUser = async (req, res, next) => {
	try {
		await userService.deleteUser(req.params);
		return res.sendJson({ message: 'User deleted successfully' });
	} catch (error) {
		return next(error);
	}
};
