const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

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

router.get('/', async (req, res) => {
    try{
        const tvShows = await TvShow.find().sort({name : 1});
        res.send(tvShows);
    } catch(ex){
        res.status(404).send();
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const tvShow = await TvShow.findById(id);
        if (!tvShow) return res.status(404).send(`TV Show with the given ID: ${id} was not found.`);
        res.send(tvShow);
    } catch (ex){
        res.status(500).send('An error occurred while retrieving the tv show.');
    }
});

router.post('/', async (req, res) => {
    let tvShow = new TvShow({
        name: req.body.name,
        genre: req.body.genre,
        rating: req.body.rating,
        firstEpisodeDate: req.body.firstEpisodeDate
    });

    try{
        tvShow = await tvShow.save();
        res.send(tvShow);
    } catch (ex){
        res.status(500).send('An error occurred while trying to insert the tv show.');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        let tvShow = await TvShow.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                genre: req.body.genre,
                rating: req.body.rating,
                firstEpisodeDate: req.body.firstEpisodeDate
            }
        }, {new: true});
        res.send(tvShow);
    } catch (ex){
        res.status(500).send(`An error occurred while trying to update the tv show with id: ${id}`);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const deletedTvShow = await TvShow.findByIdAndDelete(id);
        if (!deletedTvShow) return res.status(404).send(`The tv show with id: ${id} could not be deleted.`);
        res.send(deletedTvShow);
    } catch (ex){
        res.status(500).send(`An error occurred while trying to delete the tv show with id: ${id}`);
    }
});

function validateTvShowName(tvShowName)
{
    let scheme = Joi.object({
        name: Joi.string().required().min(3)
    });

    return scheme.validate({ name: tvShowName });
}

module.exports = router;