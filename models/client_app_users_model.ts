import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { ClientAppInterface } from "./client_apps_models";
import { UserLimitedInterface } from "./user";


export interface ClientAppUserInterface {
	_id: ObjectId,
	name: string,
	email: string,
	username: string,
	password: string,
	app: ClientAppInterface,
	client: ClientInterface,
	user: UserLimitedInterface,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export const ClientAppUserSchema = new mongoose.Schema<ClientAppUserInterface>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	app: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},
	client: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true },
	},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true }
	}
});

export const ClientAppUserModel = mongoose.model<ClientAppUserInterface>("ClientAppUser", ClientAppUserSchema);