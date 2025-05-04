import Joi from "joi";
import { commonSchemaFields } from "../../Common/helpers/joiHelpers";

export const noteSchema = Joi.object({
    ...commonSchemaFields,
    userId: Joi.string().required(),
    name: Joi.string().required(),
    date: Joi.date().required(),
    content: Joi.string().min(2).required(),
    isSticky: Joi.boolean().required(),
    notes: Joi.string().optional().allow("", null),
});