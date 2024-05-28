import mongoose, { ObjectId } from "mongoose";
import { UserLimitedInterface } from "./user";
import { EventLimitedInterface } from "./event";
import { ClientInterface } from "./client";

export interface InviteInterface {
	_id: ObjectId,
	firstName: string,
	lastName: string,
	email: string,
	phone: string,
	type: string,
	event: EventLimitedInterface,
	client: ClientInterface,
	
	user: UserLimitedInterface,
	token: string,
	open: boolean,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const InviteSchema = new mongoose.Schema<InviteInterface>({

	firstName: { type: String, required: false },
	lastName: { type: String, required: false },
	email: { type: String, required: false },
	phone: { type: String, required: false },
	type: { type: String, required: true },

	event: {
		_id: { type: mongoose.Schema.Types.ObjectId },
		name: { type: String, required: true },
	},

	client: {
		_id: { type: mongoose.Schema.Types.ObjectId },
		name: { type: String, required: true },
	},

	user: {
		type: {
			_id: { type: mongoose.Schema.Types.ObjectId },
			name: { type: String, required: true }
		},
		required: false
	},
	token: { type: String, required: true},

	open: { type: Boolean, required: true, default: true},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const InviteModel =  mongoose.model<InviteInterface>("Invite", InviteSchema);