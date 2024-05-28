import express, { Request, Response } from "express";
import { NewEmailForm, NewEmailTemplateForm } from "../forms/email_forms";
import { EmailModel, EmailTemplateModel } from "../models/email_model";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
	EmailModel.find({ "client._id": res.locals.client._id }, (err: any, emails: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		return res.json(emails);
	});
});

router.get("/:emailId", (req: Request, res: Response) => {
	EmailModel.findById(req.params.emailId, (err: any, email: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		if (email){
			return res.json(email);
		} else {
			return res.status(404).json({
				message: "Email not found"
			});
		}
	});
});


router.put("/:emailId", (req: Request, res: Response) => {
	let {error, value: updatedInfo} = NewEmailForm.validate(req.body);
	if (error) return res.status(500).json({
		message: error.details[0].message
	});

	EmailModel.findOneAndUpdate({ "_id": req.params.emailId }, updatedInfo, { new: true }, (err: any, updatedEmail) => {
		if (err) return res.status(500).json({
			message: "Unable to update email"
		});

		return res.json(updatedEmail);
	});
});

router.delete("/:emailId", (req: Request, res: Response) => {
	EmailModel.findOneAndDelete({ "_id": req.params.templateId }, (err: any, deletedEmail: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		if (deletedEmail){
			return res.json(deletedEmail);
		} else {
			return res.status(404).json({
				message: "Email not found."
			});
		}
	});
});

router.post("/", (req: Request, res: Response) =>  {
	let {error, value: emailInfo} = NewEmailForm.validate(req.body);
	if (error) return res.status(500).json({
		message: error.details[0].message
	});


	const data = {
		client: res.locals.client, 
		event: res.locals.event, 
		user: res.locals.user, 
		...emailInfo
	};

	const email = new EmailModel(data);
	email.save((err: any, newEmail: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		res.json(newEmail);
	});
});


router.get("/templates", (req: Request, res: Response) => {
	EmailTemplateModel.find({"client._id": res.locals.client._id}, (err: any, templates: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		return res.json(templates);
	});
});


router.get("/templates/:templateId", (req: Request, res: Response) => {
	EmailTemplateModel.findById(req.params.templateId, (err: any, templates: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		return res.json(templates);
	});
});


router.put("/templates/:templateId", (req: Request, res: Response) => {
	let {error, value: templateInfo} = NewEmailTemplateForm.validate(req.body);
	if (error) return res.status(500).json({
		message: error.details[0].message
	});

	EmailTemplateModel.findOneAndUpdate({ "_id": req.params.templateId }, templateInfo, { new: true }, (err: any, updatedTemplateInfo: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		res.json(updatedTemplateInfo);
	});
});


router.delete("/templates/:templateId", (req: Request, res: Response) => {
	EmailTemplateModel.findOneAndDelete({ "_id": req.params.templateId },  (err: any, deletedTemplate: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		if (deletedTemplate){
			return res.json(deletedTemplate);
		} else {
			return res.status(404).json({
				message: "Email template not found."
			});
		}
	});
});


router.post("/templates", (req: Request, res: Response) =>  {
	let {error, value: templateInfo} = NewEmailTemplateForm.validate(req.body);
	if (error) return res.status(500).json({
		message: error.details[0].message
	});

	const email = new EmailTemplateModel({
		client: res.locals.client,
		user: res.locals.user, 
		...templateInfo
	});
	
	email.save((err: any, newEmail: any) => {
		if (err) return res.status(500).json({
			message: err.message
		});

		res.json(newEmail);
	});
});

module.exports = router