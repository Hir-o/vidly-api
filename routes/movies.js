const express = require('express');
const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');
const router = express.Router();
const Joi = require('joi');

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

router.get('/', async (req, res) => {
    try{
        const movies = await Movie.find();
        res.send(movies)
    } catch (ex){
        res.status(500).send('An error occurred while retrieving movies.');
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try{
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).send(`The movie with the given ID:${id} was not found.`);
        res.send(movie);
    }catch(ex){
        res.status(500).send('An error occurred while retrieving the movie.');
    }
});

router.post('/', async (req, res) => {
    let movie = new Movie({
        name: req.body.name,
        genre: req.body.genre,
        rating: req.body.rating,
        releaseDate: req.body.releaseDate
    });

    try{
        movie = await movie.save();
        res.send(movie);
    }catch(ex){
        res.status(500).send('An error occurred while inserting the movie.');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const result = await Movie.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                genre: req.body.genre,
                rating: req.body.rating,
                releaseDate: req.body.releaseDate
            }
        }, {new: true});
        res.send(result);
    } catch (ex){
        res.status(404).send(`The movie with the given ID:${id} was not found.`);
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const result = await Movie.findByIdAndDelete(id);
        if (!result) return res.status(404).send(`The movie with the given ID:${id} was not found.`);
        res.send(result);
    }catch (ex){
        res.status(404).send(`The movie with the given ID:${id} was not found.`);
    }
});

function validateMovieName(movieName){
    const scheme = Joi.object({
        name: Joi.string().required().min(3)
    });

    return scheme.validate({name: movieName});
}

module.exports = router;