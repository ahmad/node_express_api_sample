import  { Request, Response, NextFunction } from "express";

import { ClientAppModel } from "../models/client_apps_models"


export const AppValidator = (req: Request, res: Response, next: NextFunction) => {
	// next();
	ClientAppModel.findById(req.params.appId, (err: any, clientApp: any) => {
		if (err) return next(err);
		if (clientApp) {
			res.locals.clientApp = clientApp;
			return next();
		} 

		return res.status(400).json({message: "Unable to verify AppId."});
	}).select("_id name");
}