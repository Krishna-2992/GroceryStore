const Joi = require('joi');

const registerValidation = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name cannot exceed 50 characters',
            'any.required': 'First name is required'
        }),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name cannot exceed 50 characters',
            'any.required': 'Last name is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Phone number must be 10 digits'
        }),

    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'any.required': 'Password is required'
        }),

    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'any.required': 'Confirm password is required'
        }),

    role: Joi.string()
        .valid('staff', 'manager', 'admin')
        .default('staff')
});

const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Invalid email format',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

const updateProfileValidation = Joi.object({
    firstName: Joi.string()
        .min(2)
        .max(50)
        .optional(),

    lastName: Joi.string()
        .min(2)
        .max(50)
        .optional(),

    email: Joi.string()
        .email()
        .optional(),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional(),

    address: Joi.string()
        .optional(),

    dateOfBirth: Joi.date()
        .optional()
});

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation
};