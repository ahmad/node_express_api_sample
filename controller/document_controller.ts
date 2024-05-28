import mongoose, { ObjectId } from "mongoose";
import { DocumentModel } from "../models/document_model";


export class DocumentController {

	createDocument(user: any, client: any, documentInfo: any){
		return new Promise((resolve: any, reject: any) => {
			const newDocument = new DocumentModel({
				user: user,
				client: client,
				... documentInfo
			});
			newDocument.save((err: any, createdDocument: any) => {
				if (err) throw new Error("Unable to create document");
				resolve(createdDocument);
			});
		});
	}

	 getDocumentsByIds(documentIds: Array<string>){
		return new Promise(async (resolve: any, reject: any) => {
			let documents: Array<any> = [];

			for (let documentId in documentIds) {
				const doc = await this.getDocumentToSend(documentIds[documentId]);
				documents.push(doc);
			}

			console.log("Documents", documents);
			// return documents;
			resolve(documents);
		});
	}


	getDocuments(clientId: String){
		return new Promise((resolve: any, reject: any) => {
			DocumentModel.find({"client._id": clientId}, (err: any, docs: any) => {
				if (err) throw new Error("Unable to get documents");
				resolve(docs);
			});
		});
	}

	
	getDocument(documentId: String){
		return new Promise((resolve: any, reject: any) => {
			DocumentModel.findById(documentId, (err: any, doc: any) => {
				if (err) throw new Error(`Unable to get document: ${documentId}`);
				resolve(doc);
			});
		});
	}

	
	getDocumentToSend(documentId: String){
		return new Promise((resolve: any, reject: any) => {
			DocumentModel.findById(documentId, (err: any, doc: any) => {
				if (err || !doc) throw new Error(`Unable to get document: ${documentId}`);
				const trackableId = new mongoose.Types.ObjectId();
				return resolve({
					documentId: doc._id,
					name: doc.name,
					location: doc.location,
					trackableId: trackableId,
					hotlink: `https://click.globaldatacapture.com/${trackableId}`
				});
			});
		});
	}

}