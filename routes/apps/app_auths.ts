import { ClientAppUserController } from "../../controller/client_app_user_controller";
import { LoginForm } from "../../forms/user_forms";

import express, { Request, Response } from "express";

const router = express.Router();


const clientAppUserController = new ClientAppUserController();

router.post('/', async (req: Request, res: Response) => {
	let {error, value: clientAppLoginInfo} = LoginForm.validate(req.body);
	if (error) return res.status(400).json({
		message: error.details[0].message
	});

	res.json(clientAppLoginInfo);

});



module.exports = router