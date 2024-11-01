const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 100
    }
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(genre){
    const schema = Joi.object({ name: Joi.string().min(3).max(100)});
    return schema.validate({name: genre.name});
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genreSchema = genreSchema;