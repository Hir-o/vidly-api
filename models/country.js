const mongoose = require('mongoose');
const Joi = require('joi');

const countrySchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50
    }
});

const Country = mongoose.model('Country', countrySchema);

function validateCountry(country){
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(50)
    });

    return schema.validate({
        name: country.name
    });
}

exports.countrySchema = countrySchema;
exports.Country = Country;
exports.validateCountry = validateCountry;