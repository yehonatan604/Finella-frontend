import Joi from "joi";

export const commonSchemaFields = {
    _id: Joi.string().allow(""),
    __v: Joi.number().allow(""),
    createdAt: Joi.string().allow(""),
    updatedAt: Joi.string().allow(""),
    status: Joi.string().allow(""),
    serialNumber: Joi.number().allow(null, ""),
};