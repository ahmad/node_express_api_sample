import Joi from "joi";
import { join } from "path";

export const OptionsValidatorForm = Joi.object({
	name: Joi.string().trim().required(),
	value: Joi.string().trim().allow('')
});



export const SurveyValidateForm = Joi.object({
	index: Joi.number(),
	question: Joi.string().required(),
	answer: Joi.array().items(Joi.string()).required(),
});

export const NewLeadForm = Joi.object({

	prefix: Joi.string().trim().allow(''),
	firstName: Joi.string().trim().allow(''),
	middleName: Joi.string().trim().allow(''),
	lastName: Joi.string().trim().allow(''),
	suffix: Joi.string().trim().allow(''),
	degree: Joi.string().trim().allow(''),

	title: Joi.string().trim().allow(''),
	company: Joi.string().trim().allow(''),
	industry: Joi.string().trim().allow(''),
	department: Joi.string().trim().allow(''),

	email: Joi.string().trim().allow(''),
	workEmail: Joi.string().trim().allow(''),
	phone: Joi.string().trim().allow(''),
	workPhone: Joi.string().trim().allow(''),
	fax: Joi.string().trim().allow(''),

	address1: Joi.string().trim().allow(''),
	address2: Joi.string().trim().allow(''),
	city: Joi.string().trim().allow(''),
	state: Joi.string().trim().allow(''),
	postal: Joi.string().trim().allow(''),
	country: Joi.string().trim().allow(''),

	survey: Joi.array().items(SurveyValidateForm),
	documents: Joi.array().items(Joi.string().trim()),
	options: Joi.array().items(OptionsValidatorForm),
});

