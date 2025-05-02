import Joi from "joi";
import { commonSchemaFields } from "../../Common/helpers/joiHelpers";

export const balanceEntrySchema = Joi.object({
    ...commonSchemaFields,
    userId: Joi.string().required(),
    name: Joi.string().required(),
    date: Joi.date().required(),
    type: Joi.string().valid("expense", "income").required(),
    price: Joi.number().required(),
    notes: Joi.string().optional().allow("", null),
});