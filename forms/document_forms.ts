import Joi from "joi";


export const NewDocumentForm = Joi.object({
	name: Joi.string().trim().required().max(200),
	location: Joi.string().trim().required().max(500)
});