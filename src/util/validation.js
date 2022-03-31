const joi = require('joi')

const checkPass = (value, helpers) => {
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/))
        return helpers.message('password must contain at least 1 letter and 1 number')
    if (!value.match(/^[a-zA-Z0-9]{3,30}$/))
        return helpers.message('password must letter and number')
    return value
}

const registerValidation = joi.object({
    name: joi.string()
        .alphanum()
        .min(6)
        .max(30)
        .required(),

    password: joi.string()
        .min(8)
        .max(1024)
        .custom(checkPass)
        .required(),

    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    phone: joi.string()
        .pattern(new RegExp('^0[0-9]{9}$'))
})


const loginValidation = joi.object({
    email: joi.string()
        .lowercase()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: joi.string()
        .min(8)
        .max(1024)
        .custom(checkPass)
        .required(),

})

const updateUserValidation = joi.object({
    name: joi.string()
        .alphanum()
        .min(6)
        .max(30),

    email: joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

    phone: joi.string()
        .pattern(new RegExp('^0[0-9]{9}$')),

    password: joi.string()
        .min(8)
        .max(1024)
        .custom(checkPass)
        .required(),

})

const createStationValidation = joi.object({
    name: joi.string()
        .min(6)
        .max(30)
        .required(),
    description: joi.string()
        .max(1000),
    latitude: joi.string()
        .length(9)
        .required(),
    longitude: joi.string()
        .length(9)
        .required(),
    ip: joi.string()
        .ip()
        .required()
})

const updateStationValidation = joi.object({
    name: joi.string()
        .alphanum()
        .min(6)
        .max(30),
    description: joi.string()
        .max(1000)
        .alphanum(),
    status: joi.boolean(),
    latitude: joi.string()
        .length(9),
    longitude: joi.string()
        .length(9),
    ip: joi.string()
        .ip()
})

const changeStatusValidation = joi.object({
    status: joi.boolean()
        .required()
})

module.exports = { registerValidation, loginValidation, updateUserValidation, createStationValidation, updateStationValidation, changeStatusValidation }