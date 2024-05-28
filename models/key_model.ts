import mongoose, { ObjectId } from "mongoose";
import { UserLimitedInterface } from "./user";
import { EventInterface } from "./event";
import { ClientInterface } from "./client";


export interface KeyInterface {
	_id: ObjectId,

	user: UserLimitedInterface,
	client: ClientInterface,
	event: EventInterface,

	accessKey: string,
	expirationDate: Date,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const KeySchema = new mongoose.Schema<KeyInterface>({
	client: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type:String, required: true }
	},

	event: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type:String, required: true }
	},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},

	accessKey: { type: String, required: true },
	expirationDate: { type: Date, required: true },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});


export const KeyModel =  mongoose.model<KeyInterface>("Key", KeySchema);