import Joi from "joi";


export const NewClientAppForm = Joi.object({
	name: Joi.string().required().trim()
});