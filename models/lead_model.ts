import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { EventInterface } from "./event";
import { UserLimitedInterface } from "./user";

export interface SurveyInterface {
	index: number,
	question: string,
	answer: Array<String>
}


export interface DocumentSentInterface {
	_id: ObjectId,
	documentId: ObjectId,
	name: string,
	location: string,
	trackableId: ObjectId,
	hotlink: string,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export interface LeadOptionInterface {
	key: string,
	name: string,
	value: string,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export interface LeadInterface {

	user: UserLimitedInterface,
	client: ClientInterface,
	event: EventInterface,

	survey: Array<SurveyInterface>,
	documents: Array<DocumentSentInterface>,

	options: Array<LeadOptionInterface>,


	prefix: string,
	firstName: string,
	middleName: string,
	lastName: string,
	suffix: string,
	degree: string,

	title: string,
	company: string,
	industry: string,
	department: string,

	email: string,
	workEmail: string,
	phone: string,
	workPhone: string,
	fax: string,

	address1: string,
	address2: string,
	city: string,
	state: string,
	postal: string ,
	country: string,


	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const DocumentSentSchema = new mongoose.Schema<DocumentSentInterface>({
	documentId: { type: mongoose.Schema.Types.ObjectId, required: true },
	name: { type: String, required: true },
	location: { type: String, required: true },
	trackableId: { type: mongoose.Schema.Types.ObjectId, required: true },
	hotlink: { type: String, required: true},

	createdAt: Date,
	updatedAt: Date
});

export const SurveySchema = new mongoose.Schema<SurveyInterface>({
	index: Number,
	question: String,
	answer: Array<String>()
});

export const LeadOptionSchema = new mongoose.Schema<LeadOptionInterface>({
	name: { type: String, required: true },
	value: { type: String, required: true },
	
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});

export const LeadSchema = new mongoose.Schema<LeadInterface>({

	user: {
		type: {
			_id: mongoose.Schema.Types.ObjectId,
			name: String
		},
		required: false
	},
	event: {
		_id: mongoose.Schema.Types.ObjectId,
		name: String
	},

	options: [LeadOptionSchema],
	survey: [SurveySchema],
	documents: [DocumentSentSchema],

	prefix: String,
	firstName: String,
	middleName: String,
	lastName: String,
	suffix: String,
	degree: String,

	title: String,
	company: String,
	industry: String,
	department: String,

	email: String,
	workEmail: String,
	phone: String,
	workPhone: String,
	fax: String,

	address1: String,
	address2: String,
	city: String,
	state: String,
	postal: String ,
	country: String,

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});


export const LeadModel =  mongoose.model<LeadInterface>("Lead", LeadSchema);