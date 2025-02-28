const Joi = require('joi')

const validator = (schema) => (payload) => schema.validate(payload,{abortEarly : false})

const signupSchema = Joi.object({
    firstname: Joi.string().min(5).max(20).required(),
    lastname : Joi.string().min(5).max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
    mobile : Joi.string().max(10).required(),
    fcmtoken : Joi.string(),
    devicetype : Joi.string(),
})  

const emailLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})





exports.validationSignup = validator(signupSchema)
exports.validationEmailLogin = validator(emailLoginSchema)