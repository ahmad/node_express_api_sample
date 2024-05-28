import mongoose, { ObjectId } from "mongoose";

export interface UserInterface {
	_id: ObjectId,
	name: string,
	company: CompanyLimitedInterface,
	email: string,
	title: string,
	phone: string,
	password: string,
	passwordChangedAt: Date | undefined,
	accountType: string,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export interface UserLimitedInterface {
	_id: ObjectId,
	name: string
}

export interface CompanyLimitedInterface {
	_id: ObjectId,
	name: string
}

export const UserSchema = new mongoose.Schema<UserInterface>({

	name: { type: String, required: true },

	title: { type: String },
	company: {
		type: {
			_id: { type: mongoose.Schema.Types.ObjectId, required: true },
			name: { type: String, required: true }
		},
		required: true
	},

	email: { type: String, unique: true, index: true },
	phone: {type: String },

	password: { type: String, required: true},

	accountType: { type: String },

	passwordChangedAt: { type: Date, default: null },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
	
});


export const User =  mongoose.model<UserInterface>("User", UserSchema);