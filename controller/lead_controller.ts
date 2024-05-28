import { LeadModel } from "../models/lead_model";
import { DocumentController } from "./document_controller";


const documentController = new DocumentController();

export class LeadController {

	async deleteAllLeads(eventId: any){
		return new Promise((resolve: any, reject: any) => {
			LeadModel.deleteMany({"event._id": eventId}, (err: any, res: any) => {
				if (err) throw new Error(err.message);
				resolve(res);
			});
		});
		
	}

	async createLead(user: any, event: any, lead: any){

		return new Promise(async (resolve: any, reject: any) => {
			let documentIds = [];
			if (lead.documents){
				documentIds = lead.documents;
				delete lead.documents;
				lead.documents = await documentController.getDocumentsByIds(documentIds);
			}

			const leadInfo = {
				user: user,
				event: event,
				... lead
			}

			console.log(leadInfo);

			const newLead = new LeadModel(leadInfo);
			newLead.save((err: any, createdLead: any) => {
				if (err) throw new Error(err.message);
				resolve(createdLead);
			});
		});
	}

	getLead(leadId: any) {
		return new Promise((resolve: any, reject: any) => {
			LeadModel.findById(leadId, (err: any, lead: any) => {
				if (err) throw new Error(err.message);
				resolve(lead);
			});
		});
	}

	getLeads(eventId: any) {
		return new Promise((resolve: any, reject: any) => {
			LeadModel.find({"event._id": eventId}, (err: any, leads: any) => {
				if (err) throw new Error("Unable to get leads");
				resolve(leads);
			});
		});
	}

	searchLeads(eventId: any, query: any, limit: any = 5){
		// console.log(query, limit);
		return new Promise((resolve: any, reject: any) => {
			LeadModel.find({
				"event._id": eventId,
				$or:[
					{
						$expr: {
							$regexMatch: {
								input: {
									$concat: ['$firstName', '$lastName']
								},
								regex: query.replace(" ", ''),
								options: 'i'
							}
						}
					},

					{"company":{"$regex": query, "$options": "i"}},
					{"email":{"$regex": query, "$options": "i"}},
				]
			}, (err: any, leads: any) => {
				if (err) throw new Error(err.message);
				resolve(leads);
			})
			.limit(limit);
		});
	}

	getOptions(leadId: any){
		return new Promise((resolve: any, reject: any) => {
			LeadModel.findById(leadId, (err: any, lead: any) => {
				if (err) throw new Error("Unable to get lead");
				resolve(lead.options);
			});
		});
	}

	
	deleteOptions(leadId: any){
		return new Promise((resolve: any, reject: any) => {
			LeadModel.findByIdAndUpdate(leadId, {
				$set: {
					"options": []
				}
			}, { new: true }, (err: any, lead: any) => {
				if (err) throw new Error("Unable to add options");
				resolve(lead.options);
			})
		});
	}
	
	deleteOptionById(leadId: any, optionId: any){
		return new Promise((resolve: any, reject: any) => {

			LeadModel.findByIdAndUpdate(leadId, {
				$pull: {
					"options": {
						"_id": optionId
					}
				}
			}, { new: true }, (err: any, lead: any) => {
				if (err) throw new Error("Unable to add options");
				resolve(lead.options);
			})
		});
	}

	updateOptionById(optionId: any, name: string, value: string){
		return new Promise((resolve: any, reject: any) => {
			LeadModel.findOneAndUpdate({ "options._id": optionId}, {
				$set: {
					"options.$.name": name,
					"options.$.value": value
				}
			}, {new: true},(err: any, lead: any) => {
				if (err) throw new Error("Unable to update option");
				resolve(lead);
			});
		});
	}
	
	addOptions(leadId: any, options: any){
		return new Promise((resolve: any, reject: any) => {
			LeadModel.findByIdAndUpdate(leadId, {
				$push: {
					"options": options
				}
			}, { new: true }, (err: any, lead: any) => {
				if (err) throw new Error("Unable to add options");
				resolve(lead.options);
			})
		});
	}

	findByOption(eventId: any, name: any, value: any, sort: any, order: any){
		let type: any = {};
		if (sort != null && order != null){
			type[sort] = order === "asc" ? 1 : -1;
		}

		return new Promise((resolve: any, reject: any) => {
			LeadModel.find({ 
				"event._id": eventId,
				"options": {
					$elemMatch: {
						"name": name,
						"value": value
					}
				}
			}, (err: any, leads: any) => {
				if (err) throw new Error(err.message);
				resolve(leads);
			}).sort(type)
		});
	}
}