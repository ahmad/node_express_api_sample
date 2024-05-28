import Joi from "joi";

export const RoomForm = Joi.object({
	name: Joi.string().trim().max(200).required(),
	description: Joi.string().trim().max(200)
})