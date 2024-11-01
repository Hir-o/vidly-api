const mongoose = require('mongoose');
const joi = require('joi');

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    genre:{
        type: Array,
        validate:{
            validator: function(v){return v.length > 0},
            message: 'A movie should have at least one genre!'
        }
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    releaseDate: {type: Date, default: Date.now},
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    let schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        rating: Joi.number().min(0).max(10)
    });

    return schema.validate({
        name: movie.name,
        rating: movie.rating,
    });
}

exports.Movie = Movie;
exports.validate = validateMovie;