import Joi from "joi";

export const addWorkplaceSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    address: Joi.object({
        street: Joi.string().required(),
        houseNumber: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        zip: Joi.string().allow(""),
    }),
    phone: Joi.object({
        main: Joi.string().required(),
        secondary: Joi.string().allow(""),
    }),
    pricePerHour: Joi.number().required(),
    pricePerMonth: Joi.number().required(),
    withVat: Joi.boolean().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().allow(""),
    notes: Joi.string().allow(""),
});