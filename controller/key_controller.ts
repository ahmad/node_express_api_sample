import { ObjectId } from "mongoose";
import { KeyModel } from "../models/key_model";
import { generateRandomToken } from "../utils/helpers";


export class KeyController {

	createKey(user: any, client:any, event:any){
		return new Promise(async (resolve: any, reject:any) => {
			const accessKey = await generateRandomToken();
			const keyInfo = {
				user: user,
				client: client,
				event: event,
				accessKey: accessKey,
				expirationDate: new Date(Date.now() + (3600 * 1000 * 24 * 30))
			}
			// console.log(keyInfo);
			const newKey = new KeyModel(keyInfo);
			newKey.save((err: any, createdKey: any) => {
				if (err) return reject(new Error(err.message));
				resolve(createdKey);
			});
		});
	}

	getKey(keyId: string){
		return new Promise((resolve: any, reject: any) => {
			KeyModel.findById(keyId, (err: any, key: any) => {
				if (err) return reject(new Error("Unable to get key."));
				resolve(key);
			});
		});
	}

	getKeys(clientId: string, eventId: string){
		return new Promise((resolve: any, reject: any) => {
			KeyModel.find({
				"client._id": clientId,
				"event._id": eventId
			}, (err: any, keys: any) => {
				if (err) return reject(new Error("Unable to get keys."));
				resolve(keys);
			});
		});
	}


	
	deleteKey(keyId: string){
		return new Promise((resolve: any, reject: any) => {
			KeyModel.deleteOne({_id: keyId}, (err: any, key: any) => {
				if (err) return reject(new Error("Unable to delete key."));
				resolve(key);
			});
		});
	}

	
	deleteKeys (clientId: string, eventId: string){
		return new Promise((resolve: any, reject: any) => {
			KeyModel.deleteMany({
				"client._id": clientId,
				"event._id": eventId
			}, (err: any, key: any) => {
				if (err) return reject(new Error("Unable to delete keys."));
				resolve(key);
			});
		});
	}

}