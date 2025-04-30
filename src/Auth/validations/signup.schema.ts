import Joi from 'joi'

export const signupSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    name: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required()
    }),
    dob: Joi.date().max('now').optional().allow(null, ""),
    password: Joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)).required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required'
        })
});
