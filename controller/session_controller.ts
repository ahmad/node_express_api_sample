import { SessionModel } from '../models/session_model';

export class Sessionontroller {
	createSession(user: any, client: any, event: any, session: any){
		return new Promise((resolve: any, reject: any) => {
			const sessionInfo = {
				user: user,
				client: client,
				event: event,
				... session
			};

			const newSession = new SessionModel(sessionInfo);
			newSession.save((err: any, createdSession: any) => {
				if (err) reject(Error(err.message));
				resolve(createdSession);
			});
		});
	}

	getSessions(eventId: string){
		return new Promise((resolve: any, reject: any) => {
			SessionModel.find({"event._id": eventId }, (err: any, sessions: any) => {
				if (err) reject(Error("Unable to get event sessions."));
				resolve(sessions);
			})
		});
	}

	getSession(sessionId: string){
		return new Promise((resolve: any, reject: any) => {
			SessionModel.findById(sessionId, (err: any, sessions: any) => {
				if (err) reject(Error("Unable to get session."));
				resolve(sessions);
			})
		});
	}

	deleteSession(sessionId: string){
		return new Promise((resolve: any, reject: any) => {
			SessionModel.findByIdAndDelete(sessionId, (err: any, session: any) => {
				if (err) reject(Error("Unable to delete session."));
				resolve(session);
			});
		});
	}

	deleteSessions(eventId: string){
		return new Promise((resolve: any, reject: any) => {
			SessionModel.deleteMany({"event._id": eventId}, (err: any, session: any) => {
				if (err) reject(Error("Unable to delete sessions."));
				resolve(session);
			});
		});
	}
}