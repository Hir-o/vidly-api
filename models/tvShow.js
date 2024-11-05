const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');
const { countrySchema } = require('./country');

const tvShowSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    genres:{
        type: [genreSchema],
        required: true
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    firstEpisodeDate: {type: Date, default: Date.now},
    country: {
        type: countrySchema
    }
});

const TvShow = mongoose.model('TvShow', tvShowSchema);

function validateTvShow(tvShow)
{
    let schema = Joi.object({
        name: Joi.string().required().min(3),
        rating: Joi.number().min(0).max(10),
    });

    return schema.validate({ 
        name: tvShow.name,
        rating: tvShow.rating 
    });
}

exports.TvShow = TvShow;
exports.validateTvShow = validateTvShow;
exports.tvShowSchema = tvShowSchema;