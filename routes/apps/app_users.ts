import { ClientAppUserController } from "../../controller/client_app_user_controller";
import { RegisterForm, UpdateProfileForm } from "../../forms/user_forms";


import express, { Request, Response } from "express"
const router = express.Router();


const clientAppUserController = new ClientAppUserController();

router.post('/', async (req: Request, res: Response) => {
	let {error, value: clientAppUserInfo} = RegisterForm.validate(req.body);
	if (error) return res.status(400).json({
		message: error.details[0].message
	});

	clientAppUserController.createUser(res.locals.user, res.locals.client, res.locals.clientApp, clientAppUserInfo)
		.then(newAppInfo => res.json(newAppInfo))
		.catch(err => res.status(500).json({message: err.message,}));
});

router.get('/', async (req: Request, res: Response) => {
	clientAppUserController.getUsers(res.locals.clientApp._id)
		.then(newAppInfo => res.json(newAppInfo))
		.catch(err => res.status(500).json({message: err.message,}));
});

router.get('/:userId', (req: Request, res: Response) => {

	clientAppUserController.getUser(req.params.userId)
		.then(newAppInfo => res.json(newAppInfo))
		.catch(err => res.status(500).json({message: err.message,}));
});

router.delete('/:userId', (req: Request, res: Response) => {
	clientAppUserController.deleteUser(req.params.userId)
		.then(user => res.json({message: "User successfully removed."}))
		.catch(err => res.status(500).json({message: err.message}));
});

router.delete("/", (req: Request, res: Response) => {
	clientAppUserController.deleteUsers(res.locals.client._id, res.locals.clientApp._id)
		.then(user => res.json({message: "All users removed successfully."}))
		.catch(err => res.status(500).json({message: err.message}));
});


router.patch('/:userId', (req: Request, res: Response) => {
	const { error, value: updatedProfile} = UpdateProfileForm.validate(req.body);
	if (error) return res.status(400).json({
		message: error.details[0].message
	});

	res.json(updatedProfile);
});

module.exports = router