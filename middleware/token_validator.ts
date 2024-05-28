import { config } from 'dotenv';
import { Token } from "../models/token";
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';

config();

const { APP_SECRET } 	= process.env;

if (!APP_SECRET){
	throw new Error("Please ensure that APP_SECRET is defined in your .env file");
}

const getToken = (headers: any) => {
	if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer'){
		return headers.authorization.split(' ')[1];
	} 
	
	return null;
}

export const TokenValidator = async (req: Request, res: Response, next: NextFunction) => {
	const token  = getToken(req.headers);
	if (!token) return res.status(401).json({
		message: "An auth token is required."
	});


	console.log("Token", token);

	// Look for a record in the database matching the token and that has not been disabled.
	Token.findOne({ token: token, disabled: false}, (err: Error, record: any) => {
		if (err) return res.status(500).json({
			message: "Unable to fetch token record."
		});

		if (!record) return res.status(401).json({
			"message": "The auth token provided is invalid"
		});

		res.locals.user = record.user;
		res.locals.token = record.token;
		res.locals.client = record.company;
		
		return next();
	});

}