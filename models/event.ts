import mongoose, { ObjectId } from "mongoose";
import { UserLimitedInterface } from "./user";
import { ClientInterface } from "./client";
import { boolean } from "joi";

export interface EventAdvanceInterface {
	type: string,
	url: string,
	endpoint: string
}


export interface EventLimitedInterface {
	_id: ObjectId,
	name: string
}

export interface EventInterface {
	_id: ObjectId,
	name: string,
	location: string,
	startTime: Date | undefined,
	endTime: Date | undefined,
	client: ClientInterface,
	user: UserLimitedInterface,
	advance: EventAdvanceInterface | undefined,
	hidden: boolean,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const EventSchema = new mongoose.Schema<EventInterface>({

	name: { type: String, required: true },
	location: { type: String },
	startTime: { type: Date },
	endTime: { type: Date },
	client: {
		_id: { type: mongoose.Schema.Types.ObjectId },
		name: { type: String, required: true },
	},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId },
		name: { type: String, required: true },
	},
	advance: {
		type: { type: String, required: true, default: 'none' },
		url: { type: String, required: false, default: '' },
		endpoint: { type: String, required: false, default: '' }
	},

	hidden: { type: Boolean, required: true, default: false },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const EventModel =  mongoose.model<EventInterface>("Event", EventSchema);