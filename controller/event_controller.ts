import { EventModel } from '../models/event';
import { LeadModel, LeadOptionInterface } from '../models/lead_model';
import { LeadController } from './lead_controller';
import { json2csv } from "json-2-csv";


export class EventController {

	// Resetting an event to it's default state
	async clearEvent(eventId: string){
		// Clear all leads
		const lead = new LeadController();
		try {
			await lead.deleteAllLeads(eventId);
		} catch (error){
			throw new Error("Unable to remove leads.");
		}
	}

	getDemoEvent(clientId: string) {
		return new Promise((resolve: any, reject: any) => {
			EventModel.findOne({"client._id": clientId, "name": "FACESDEMO2024"}, (err: any, events: any) => {
				if (err) throw new Error("Unable to fetch events");
				return resolve(events);
			});
		});
	}

	getAllEvents(clientId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.find({"client._id": clientId}, (err: any, events: any) => {
				if (err) throw new Error("Unable to fetch events");
				return resolve(events);
			});
		});
	}


	getActiveEvents(clientId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.find({"client._id": clientId, "hidden": false}, (err: any, events: any) => {
				if (err) throw new Error("Unable to fetch events");
				return resolve(events);
			});
		});
	}




	getHiddenEvents(clientId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.find({"client._id": clientId, "hidden": true}, (err: any, events: any) => {
				if (err) throw new Error("Unable to fetch events");
				return resolve(events);
			});
		});
	}

	getEvent(eventId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.findById(eventId, (err: any, event: any) => {
				if (err) throw new Error("Unable to fetch event");
				return resolve(event);
			});
		});
	}


	createEvent(user: any, clientInfo: any, eventInfo: any){
		const event = new EventModel({
			user: user,
			client: clientInfo,
			... eventInfo
		});

		return new Promise((resolve: any, reject: any) => {
			event.save((err: any, newEvent: any) => {
				if (err) return reject(err);
				return resolve(newEvent);
			});
		});
	}


	updateEvent(eventId: string, updates: any) {
		return new Promise((resolve: any, reject: any) => {
			EventModel.findByIdAndUpdate(eventId, updates, { new: true }, (err: any, event: any) => {
				if (err) throw new Error("Unable to update event");
				return resolve(event);
			});
		});
	}

	hideEvent(eventId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.findByIdAndUpdate(eventId, {
				hidden: true
			}, { new: true }, (err: any, updatedEvent: any) => {
				if (err) throw new Error("Unable to hide event");
				return resolve(updatedEvent);
			});
		});
	}

	deleteEvent(eventId: string){
		return new Promise((resolve: any, reject: any) => {
			EventModel.findByIdAndDelete(eventId, (err: any, event: any) => {
				if (err) throw new Error("Unable to remove event");
				return resolve(event);
			});
		});
	}

	/**
	 * Get all fields available to export
	 * @param eventId 
	 * @returns 
	 */
	getExportFields(eventId: string) {
		return new Promise((resolve: any, reject: any) =>  {
			LeadModel.find({"event._id": eventId}, async (err: any, leads: any) =>  {
				if (err) throw new Error("Unable to get leads");

				// let lines: any[] = [];
				let headers: any = {};
				leads.forEach((lead: any) => {
					let line = { ...lead._doc };

					if (lead.options){
						delete line.options;
						lead.options.forEach((option: any) => {
							const key = `Option - ${option.name}`;
							if (headers[key] === undefined){
								headers[key] = key;
							}
						});
					}

					Object.keys(line).forEach((key: any) => {
						if (headers[key] === undefined){
							headers[key] = key;
						}
					});

				});

				return resolve(headers);
			});
		});
	}

	/**
	 * Exports an event. If $field is provide only the fields listed will be exported.
	 * $fields allows you to rename column headers.
	 * @param eventId 
	 * @param fields optional
	 * @returns 
	 */
	exportEvent(eventId: string, fields: any = {}){
		
		let mapping: any = null;
		const keys = Object.keys(fields);
		if (keys.length > 0){
			mapping = [];
			keys.forEach((key: string) => {
				mapping.push({
					title: fields[key],
					field: key
				});
			});
		}

		return new Promise((resolve: any, reject: any) =>  {
			LeadModel.find({"event._id": eventId}, async (err: any, leads: any) =>  {
				if (err) throw new Error("Unable to get leads");

				let lines: any[] = [];
				leads.forEach((lead: any) => {
					let line = { ...lead._doc };

					if (lead.options){
						delete line.options;

						lead.options.forEach((option: any) => {
							line[`Option - ${option.name}`] = option.value;
						});
					}

					lines.push(line);
				});

				json2csv(lines, (err: any, csv: any) => {
					if (err) return reject(err);
					return resolve(csv);
				}, {
					keys: mapping,
					delimiter: {
						wrap: '"',
						field: ",",
						eol: "\n"	
					},
					emptyFieldValue: "",
					expandArrayObjects: true,
					
				});
			});
		});
	}
}