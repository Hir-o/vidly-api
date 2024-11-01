const mongoose = require('mongoose');
const Joi = require('joi');

const directorSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    lastName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    }
});

const Director = mongoose.model('Director', directorSchema);

function validateDirector(director)
{
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(255),
        lastName: Joi.string().min(3).max(255)
    });

    return schema.validate({
        firstName: director.firstName,
        lastName: director.lastName
    });
}

exports.Director = Director;
exports.validateDirector = validateDirector;
exports.directorSchema = directorSchema;