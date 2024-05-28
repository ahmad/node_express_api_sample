import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { EventInterface } from "./event";
import { UserLimitedInterface } from "./user";


export interface EmailTemplateInterface {
	_id: ObjectId,
	name: string,
	html: string,
	text: string,
	
	client: ClientInterface,
	user: UserLimitedInterface,

	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export interface EmailRecipientInterace {
	name: string,
	email: string
}

export interface EmailConfigInterface {
	subject: string,
	from: EmailRecipientInterace,
	replyTo: EmailRecipientInterace,
	bcc: Array<EmailRecipientInterace>
	cc: Array<EmailRecipientInterace>
}

export interface EmailInterface {
	_id: ObjectId,
	name: string,
	templateId: ObjectId,
	
	client: ClientInterface,
	event: EventInterface,
	user: UserLimitedInterface,

	config: EmailConfigInterface,

	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export const EmailSchema = new mongoose.Schema<EmailInterface>({
	name: { type: String, required: true },
	templateId: { type: mongoose.Schema.Types.ObjectId, required: true },
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

	config: {
		subject: { type: String, required: true },
		from: {
			type: {
				name: { type: String, required: false},
				email: { type: String, required: true },
			},
			required: true
		},
		replyTo: {
			type: {
				name: { type: String, required: false},
				email: { type: String, required: true },
			},
			required: false
		},
		cc: [
			{
				name: { type: String, required: false},
				email: { type: String, required: true },
			}
		],
		bcc: [
			{
				name: { type: String, required: false},
				email: { type: String, required: true },
			}
		]
	},

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});

export const EmailTemplateSchema = new mongoose.Schema<EmailTemplateInterface>({

	name: { type: String, required: true },
	html: { type: String, required: true },
	text: { type: String, default: ""},

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

export const EmailTemplateModel =  mongoose.model<EmailTemplateInterface>("EmailTemplate", EmailTemplateSchema);
export const EmailModel =  mongoose.model<EmailInterface>("Email", EmailSchema);