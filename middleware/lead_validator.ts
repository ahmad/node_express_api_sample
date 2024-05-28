import { isValidObjectId } from "mongoose";
import { LeadModel } from "../models/lead_model";
import { Request, Response, NextFunction } from "express";


export const LeadValidator = (req: Request, res: Response, next: NextFunction) => {
	const leadId = req.params.leadId;
	if (isValidObjectId(leadId) === false){
		return res.status(400).json({
			message: "Invalid LeadId provided"
		});
	}

	LeadModel.findById(leadId, (err: any, lead: any) => {
		if (err) throw new Error("Unable to validate lead");
		
		if (lead === null || lead.length === 0){
			return res.status(404).json({
				message: "Lead not found!"
			});
		}

		next();
	}).select("_id name");
}