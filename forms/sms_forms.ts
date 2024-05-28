import Joi from "joi"

export const SMSForm = Joi.object({
	type: Joi.string().trim().valid('SMS').max(10).min(1).required(),
	to: Joi.string().regex(/^[0-9]{10}$/).messages({'string.pattern.base': `Phone number must have 10 digits.`}).required(),
	message: Joi.string().trim().min(1).max(160)
});