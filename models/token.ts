import mongoose from 'mongoose';
import { CompanyLimitedInterface, UserLimitedInterface } from './user';


export interface TokenInterface {
	user: UserLimitedInterface,
	company: CompanyLimitedInterface,
	disabled: boolean,
	token: string,
	accountType: string,
	createdAt: Date | undefined,
	updatedAt: Date | undefined
}

export const TokenSchema = new mongoose.Schema<TokenInterface>({
	
	user: { 
		_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true},
		name: { type: String, required: true },
	},
	company: { 
		_id: { type: mongoose.Schema.Types.ObjectId, required: true, index: true},
		name: { type: String, required: true },
	},
	disabled: { type: Boolean, required: true, default: false },
	token: { type: String, required: true, unique: true, index: true},
	accountType: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }
});


export const Token = mongoose.model<TokenInterface>("Tokens", TokenSchema);