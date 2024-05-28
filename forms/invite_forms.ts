import Joi from "joi";

export const NewInviteForm = Joi.object({

    firstName: Joi.string().trim(),
	lastName: Joi.string().trim(),

    title: Joi.string().trim(),
	company: Joi.string().trim(),
    email: Joi.string().trim(),
	phone: Joi.string().trim(),

    type: Joi.string().trim().required().valid("TEXT", "EMAIL"),
});