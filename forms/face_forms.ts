import Joi from "joi";

const NewFaceImage = Joi.object({
    type: Joi.string().required(),
    image: Joi.string().required().min(10000).max(10000000)
});

export const NewFaceForm = Joi.object({
    firstName: Joi.string().trim(),
	lastName: Joi.string().trim(),

    title: Joi.string().trim(),
	company: Joi.string().trim(),
    email: Joi.string().trim(),
	phone: Joi.string().trim(),


    type: Joi.string().trim().required(),
    filename: Joi.string().trim().required(),
    originalName: Joi.string().trim().required(),
    path: Joi.string().trim().required(),
    url: Joi.string().trim().required(),
    thumb: Joi.string().trim().required()
});