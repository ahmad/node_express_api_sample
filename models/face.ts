import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { EventInterface } from "./event";
import { UserLimitedInterface } from "./user";


export interface FaceInterface {
	user: UserLimitedInterface,
	client: ClientInterface,
	event: EventInterface,


    firstName: String,
    lastName: String,
    title: String,
    company: String,
    phone: String,
    email: String,


	originalName: String,
    filename: String,
    type: String,
    path: String,
    url: String,
    thumb: String,

	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const FaceSchema = new mongoose.Schema<FaceInterface>({

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

    firstName: { type: String},
	lastName: { type: String },

	title: { type: String },
	company: { type: String },

	phone: { type: String },
	email: { type: String },

    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    type: { type: String, required: true },
    path: { type: String, required: true },
    url: { type: String, required: true },
    thumb: { type: String, required: true },

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const FaceModel =  mongoose.model<FaceInterface>("Faces", FaceSchema);