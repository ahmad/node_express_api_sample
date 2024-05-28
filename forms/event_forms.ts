import Joi from "joi";

export const NewLeadForm = Joi.object({

	name: Joi.string().trim().required(),
	
});

