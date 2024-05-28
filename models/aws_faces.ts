import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { EventInterface } from "./event";
import { UserLimitedInterface } from "./user";


export interface AwsFaceCollectionInterface {
	user: UserLimitedInterface,
	client: ClientInterface,
	event: EventInterface,

    name: string,

	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const AwsFaceCollectionSchema = new mongoose.Schema<AwsFaceCollectionInterface>({

	user: {
		type: {
			_id: mongoose.Schema.Types.ObjectId,
			name: String
		},
		required: true
	},
	client: {
		_id: mongoose.Schema.Types.ObjectId,
		name: String
	},
	event: {
		_id: mongoose.Schema.Types.ObjectId,
		name: String
	},

    name: { type: String, required: true },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});


export const AwsFaceCollectionModel =  mongoose.model<AwsFaceCollectionInterface>("AwsFacesCollection", AwsFaceCollectionSchema);