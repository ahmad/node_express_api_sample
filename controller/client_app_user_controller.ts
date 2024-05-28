import { ObjectId } from "mongoose";
import bcrypt from "bcrypt";
import { ClientAppUserModel } from "../models/client_app_users_model";


export class ClientAppUserController {


	createUser(user: any, client: any, app: any, newUserInfo: any){
		return new Promise((resolve: any, reject: any) => {
			// Hashing password
			bcrypt.hash(newUserInfo.password, 10, (err: any, hashedPassword: any) => {
				if (err) return reject(new Error("Unable to hash password."));

				newUserInfo.password = hashedPassword;
				const newClientAppUser = new ClientAppUserModel({
					user: user,
					client: client,
					app: app,
					username: app._id + "/" + newUserInfo.email,
					... newUserInfo,
				});

				newClientAppUser.save((err: any, createdUser: any) => {
					if (err) return reject(err);
					resolve(createdUser);
				});
			});
		});
	}

	getUser(userId: string){
		return new Promise((resolve: any, reject: any) => {
			ClientAppUserModel.findById(userId, (err: any, user: any) => {
				if (err) return reject(err);
				resolve(user);
			});
		});
	}

	getUsers(appId: string){
		return new Promise((resolve: any, reject: any) => {
			ClientAppUserModel.find({"app._id": appId}, (err: any, users: any) => {
				if (err) return reject(err);
				resolve(users);
			});
		});
	}

	updateUser(){

	}

	deleteUser(userId:  string){
		return new Promise((resolve: any, reject: any) => {
			ClientAppUserModel.findByIdAndDelete(userId, (err: any, user: any) => {
				if (err) return reject(err);
				resolve(user);
			});
		});
	}

	deleteUsers(clientId: ObjectId, appId: ObjectId){
		return new Promise((resolve: any, reject: any) => {
			ClientAppUserModel.deleteMany({"client._id": clientId,"app._id": appId}, (err: any, user: any) => {
				if (err) return reject(new Error("Unable to remove users"));
				resolve(user);
			});
		});
	}
}