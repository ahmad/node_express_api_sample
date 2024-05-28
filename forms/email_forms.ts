import Joi from "joi";

export const EmailRecipientDetail = Joi.object({
	name: Joi.string().max(200),
	email: Joi.string().required().max(200).min(3)
});

export const NewEmailForm = Joi.object({
	name: Joi.string().required().max(50),
	templateId: Joi.string().required().max(50).min(20),
	config: Joi.object({
		subject: Joi.string().required().max(200),
		from: EmailRecipientDetail.required(),
		replyTo: EmailRecipientDetail,
		cc: Joi.array().items(EmailRecipientDetail),
		bcc: Joi.array().items(EmailRecipientDetail)
	}).required()
});


export const NewEmailTemplateForm = Joi.object({
	name: Joi.string().required().max(50),
	html: Joi.string().required(),
	text: Joi.string().min(0)
});