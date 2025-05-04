import Joi from "joi";
import { commonSchemaFields } from "../../Common/helpers/joiHelpers";

export const todoSchema = Joi.object({
    ...commonSchemaFields,
    userId: Joi.string().required(),
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    toDoStatus: Joi.string().optional().allow("", null).default("PENDING"),
    description: Joi.string().optional().allow("", null),
    tasks: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                priority: Joi.number().required(),
                taskStatus: Joi.string().optional().allow("", null).default("PENDING"),
                notes: Joi.string().optional().allow("", null),
            })
        )
        .optional()
        .allow("", null),
    notes: Joi.string().optional().allow("", null),
});