import crypto from "node:crypto"
const ObjectId = require('mongoose').Types.ObjectId;

export const generateRandomToken = async (size: number = 20) => {
	return new Promise((resolve: any, rejects: any) => {
		crypto.randomBytes(size, (err: any, buffer: Buffer) => {
			if (err) return rejects(new Error("Unable to random token"));
			return resolve(buffer.toString("hex"));
		});
	})
}

export const isValidObjectId = (value: string)  => {
	return ObjectId.isValid(value);
}