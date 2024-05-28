import { EventModel } from "../models/event";
import { isValidObjectId } from "../utils/helpers";
import  { Request, Response, NextFunction } from "express";


export const EventValidator = (req: Request, res: Response, next: NextFunction) => {
	const eventId = req.params.eventId;
	if (isValidObjectId(eventId) === false){
		return res.status(400).json({
			message: "Invalid EventId provided"
		});
	}

	EventModel.findById(eventId, (err: any, event: any) => {
		if (err) throw new Error("Unable to validate event.");
		
		if (event === null) return res.status(404).json({
			message: "Invalid EventId"
		});

		res.locals.event = event;
		next();
	}).select("_id name");
}