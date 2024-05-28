import mongoose, { ObjectId } from "mongoose";
import { ClientInterface } from "./client";
import { UserLimitedInterface } from "./user";

export interface ClientAppInterface {
	_id: ObjectId,
	name: string,
	user: UserLimitedInterface,
	client: ClientInterface,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const ClientAppSchema = new mongoose.Schema<ClientAppInterface>({
	name: { type: String, required: true},
	user: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true }
	},
	client: {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		name: { type: String, required: true }
	},

	createdAt: { type: Date, default: Date.now() },
	updatedAt: { type: Date, default: Date.now() }
});

export const ClientAppModel = mongoose.model<ClientAppInterface>("ClientApp", ClientAppSchema);