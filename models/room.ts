import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { UserLimitedInterface } from "./user";
import { EventLimitedInterface } from "./event";


export interface RoomInterface {
    name: String,
	description: String,

	client: ClientInterface,
	user: UserLimitedInterface,
	event: EventLimitedInterface,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export const FaceSchema = new mongoose.Schema<RoomInterface>({
    name: { type: String, required: true },
	description: { type: String, required: false},

	client: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},

	event: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const Room =  mongoose.model<RoomInterface>("Face", FaceSchema);