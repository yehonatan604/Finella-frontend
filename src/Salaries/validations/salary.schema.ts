import Joi from "joi";
import { commonSchemaFields } from "../../Common/helpers/joiHelpers";

export const salarySchema = Joi.object({
    ...commonSchemaFields,
    userId: Joi.string().required(),
    workPlaceId: Joi.string().required(),
    date: Joi.string().required(),
    hours: Joi.array().items(Joi.object().keys({
        ...commonSchemaFields,
        day: Joi.string().required(),
        startTime: Joi.string().required(),
        endTime: Joi.string().required(),
        notes: Joi.string().allow("").optional(),
    })),
    notes: Joi.string().allow("").optional(),
});