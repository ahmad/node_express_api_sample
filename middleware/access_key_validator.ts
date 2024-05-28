import { KeyModel } from "../models/key_model";
import  { Request, Response, NextFunction } from "express";



export const AccessKeyValidator = (req: Request, res: Response, next: NextFunction) => {
	KeyModel.findOne({accessKey: req.params.accessKey}, (err: any, key: any) => {
		if (err) return res.status(500).json({message: "Unable to validate access token."});
		if (!key) return res.status(400).json({message: "Unable to validate access token."});

		if (Date.now() > key.expirationDate){
			return res.status(400).json({message: "AccessKey has expired."});
		}
		res.locals.accessKey = key;
		next();
	}).select("_id accessKey expirationDate");
}