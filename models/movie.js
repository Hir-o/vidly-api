const mongoose = require('mongoose');
const Joi = require('joi');
const { directorSchema } = require('./director')
const { genreSchema } = require('./genre');
const { countrySchema } = require('./country');

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    directors: {
        type: [directorSchema],
        required: true,
    },
    genres:{
        type: [genreSchema],
        required: true
    },
    numbersInStock:{
        type: Number,
        min: 0,
    },
    dailyRentalRate:{
        type: Number,
        min: 0
    },
    country:{
        type: countrySchema
    }
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    let schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        rating: Joi.number().min(0).max(10),
        numbersInStock: Joi.number().min(0),
        //genreIds: Joi.array().required(),
        dailyRentalRate: Joi.number().min(0)
    });

    return schema.validate({
        name: movie.name,
        rating: movie.rating,
        numbersInStock: movie.numbersInStock,
        dailyRentalRate: movie.dailyRentalRate,
    });
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
exports.movieSchema = movieSchema;