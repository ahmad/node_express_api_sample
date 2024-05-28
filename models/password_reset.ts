import mongoose from "mongoose";
import { UserLimitedInterface } from "./user";

interface PasswordResetInterface {
	user: UserLimitedInterface,
	token: string,
	usedAt: Date | null,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}


export const PasswordResetSchema = new mongoose.Schema<PasswordResetInterface>({

	user:  {
		_id: { type: mongoose.Schema.Types.ObjectId, required: true},
		name: { type: String, required: true },
	},
	
	token: { type: String, unique: true, index: true },
	usedAt: { type: Date, default: null},

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});


export const PasswordReset =  mongoose.model<PasswordResetInterface>("PasswordReset", PasswordResetSchema);