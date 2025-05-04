import Joi from "joi";
import { commonSchemaFields } from "../../Common/helpers/joiHelpers";

export const todoSchema = Joi.object({
    ...commonSchemaFields,
    userId: Joi.string().required(),
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    toDoStatus: Joi.string().optional().allow("", null).default("PENDING"),
    description: Joi.string().required(),
    tasks: Joi.array().items(Joi.object({
        ...commonSchemaFields,
        name: Joi.string().required(),
        taskStatus: Joi.string().optional().default("PENDING"),
        priority: Joi.number().required(),
        notes: Joi.string().allow(""),
    })),
    notes: Joi.string().optional().allow("", null),
});