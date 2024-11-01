const mongoose = require('mongoose');
const Joi = require('joi');

const tvShowSchema = new mongoose.Schema({
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
            message: 'A movie should have at least one category!'
        }
    },
    rating:{
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    firstEpisodeDate: {type: Date, default: Date.now},
});

const TvShow = mongoose.model('TvShow', tvShowSchema);

function validateTvShowName(tvShow)
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
exports.validateTvShow = validateTvShowName;