import { ClientAppController } from '../controller/client_app_controller';
import { NewClientAppForm } from '../forms/client_app_forms';
import express, { Request, Response } from "express";

const router = express.Router();


const clientAppController = new ClientAppController();

router.post('/', async (req: Request, res: Response) => {
	let {error, value: clientAppInfo} = NewClientAppForm.validate(req.body);
	if (error) return res.status(400).json({
		message: error.details[0].message
	});

	clientAppController.createApp(res.locals.user, res.locals.client, clientAppInfo)
		.then(newAppInfo => res.json(newAppInfo))
		.catch(err => res.status(500).json({message: err.message,}))
});

router.get('/', async (req: Request, res: Response) => {
	clientAppController.getApps(res.locals.client._id)
		.then(apps => res.json(apps))
		.catch(err => res.status(500).json({message: err.message}));
});

router.get('/:appId', (req: Request, res: Response) => {
	clientAppController.getApp(req.params.appId)
		.then(app => res.json(app))
		.catch(err => res.status(500).json({message: err.message}));
});


module.exports = router