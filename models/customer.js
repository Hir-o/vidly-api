const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = mongoose.Schema({
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
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate:{
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    phone:{
        type: String,
        trim: true,
        unique: true,
    },
    category:{
        type: String,
        required: true,
        trim: true,
        enum: ['Bronze', 'Silver', 'Gold']
    }
});

const Customer = mongoose.model('Customer', customerSchema); 

function validateCustomer(customer)
{
    let schema = Joi.object({
        firstName: Joi.string().required().min(5).max(255),
        lastName: Joi.string().required().min(5).max(255),
        email: Joi.string().required().min(5).max(255),
        phone: Joi.string().required().min(5).max(255)
    });

    return schema.validate({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone
    });
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
exports.customerSchema = customerSchema;