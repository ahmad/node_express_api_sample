import mongoose, { ObjectId } from "mongoose";
import { UserLimitedInterface } from "./user";
import { EventInterface } from "./event";
import { ClientInterface } from "./client";

export interface ActionInterface {
	identifier: string,
	type: string,
	startTime: Date,
	endTime: Date,

	createdAt: Date | undefined,
}

export interface SessionInterface {
	_id: ObjectId,
	identifier: string,

	startTime: Date,
	endTime: Date,

	actions: Array<ActionInterface>,

	user: UserLimitedInterface,
	client: ClientInterface,
	event: EventInterface,

	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const SessionActionSchema = new mongoose.Schema<ActionInterface>({
	identifier: { type: String, required: true},
	type: { type: String, required: true},
	startTime: { type: Date, required: true},
	endTime: { type: Date, required: true},

	createdAt: { type: Date, default: Date.now() }
});


export const SessionSchema = new mongoose.Schema<SessionInterface>({

	identifier: { type: String, required: true },

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
		name: { type: String, required: true }
	},

	
	startTime: { type: Date },
	endTime: { type: Date },

	actions: [SessionActionSchema],

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const SessionModel =  mongoose.model<SessionInterface>("Session", SessionSchema);