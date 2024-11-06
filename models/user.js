const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        maxLength: 255,
    },
    email:{
        type: String,
        required: true,
        unique:true,
        trim: true,
        maxLength: 255,
    },
    password:{
        type: String,
        required: true,
        minLength: 6,
        maxLength: 1024,
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_KEY);
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().max(255),
        email: Joi.string().email(),
        password: Joi.string().alphanum().required().min(6).max(255),
    });

    return schema.validate({
        name: user.name,
        email: user.email,
        password: user.password
    });
} 

module.exports.User = User;
module.exports.validateUser = validateUser;