import { FaceModel } from "../models/face";


export class FaceController {


    save(faceInfo: any){
		return new Promise(async (resolve: any, reject:any) => {
            const newFace = new FaceModel(faceInfo);
			newFace.save((err: any, createdLead: any) => {
				if (err) return reject(new Error("Unable to save face information."));
				resolve(createdLead);
			});
        });
    }

    deleteFaces(eventId: any){
        return new Promise(async (resolve: any, reject:any) => {
            FaceModel.deleteMany({ "event._id": eventId }, (err: any, faces: any) => {
				if (err) return reject(new Error("Unable to delete faces."));
				resolve(faces);
			})
        });
    }

    deleteFace(faceId:any){
        return new Promise(async (resolve: any, reject:any) => {
            FaceModel.findByIdAndDelete(faceId, (err: any, face: any) => {
				if (err) return reject(new Error("Unable to delete face."));
				resolve(face);
			})
        });
    }

    getFaces(eventId: any){
        return new Promise(async (resolve: any, reject:any) => {
            FaceModel.find({ "event._id": eventId }, (err: any, faces: any) => {
				if (err) return reject(new Error("Unable to get faces."));
				resolve(faces);
			})
        });
    }

    getFace(faceId: any){
        return new Promise(async (resolve: any, reject:any) => {
            FaceModel.findById(faceId, (err: any, face: any) => {
				if (err) return reject(new Error("Unable to get face."));
				resolve(face);
			})
        });
    }
}