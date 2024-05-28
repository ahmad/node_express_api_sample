import mongoose, { ObjectId } from "mongoose";
import { UserLimitedInterface } from "./user";

export interface ClientInterface {
	_id: ObjectId,
	name: string,
	user: UserLimitedInterface,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const ClientSchema = new mongoose.Schema<ClientInterface>({

	name: { type: String, required: true },

	user: {
		type: {
			_id: { type: mongoose.Schema.Types.ObjectId },
			name: { type: String, required: true }
		},
		required: false
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const ClientModel =  mongoose.model<ClientInterface>("Client", ClientSchema);