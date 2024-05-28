import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { UserLimitedInterface } from "./user";

export interface DocumentInterface {
	_id: ObjectId,
	name: string,
	location: string,
	client: ClientInterface,
	user: UserLimitedInterface,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export const DocumentSchema = new mongoose.Schema<DocumentInterface>({

	name: { type: String, required: true },
	location: { type: String, required: true },

	client: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type:String, required: true }
	},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true }
	},

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const DocumentModel =  mongoose.model<DocumentInterface>("Document", DocumentSchema);