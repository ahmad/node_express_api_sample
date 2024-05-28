import { ObjectId } from "mongoose";
import { ClientAppModel } from "../models/client_apps_models";

export class ClientAppController {
	getApp(appId: string) {
		return new Promise((resolve: any, reject: any) => {
			ClientAppModel.findById(appId, (err: any, app: any) => {
				if (err) return reject(err);
				resolve(app);
			});
		});
	}

	getApps(clientId: string) {
		return new Promise((resolve: any, reject: any) => {
			ClientAppModel.find({"client._id": clientId}, (err: any, apps: any) => {
				if (err) return reject(err);
				resolve(apps);
			});
		});
	}

	createApp(user: any, client: any, appInfo: any){
		return new Promise((resolve: any, reject: any) => {
			const clientAppInfo = {
				user: user,
				client: client,
				... appInfo
			};

			const newClientApp = new ClientAppModel(clientAppInfo);
			newClientApp.save((err: any, createdClientApp: any) => {
				if (err) return reject(new Error(err.message));
				resolve(createdClientApp);
			});
		});
	}
}