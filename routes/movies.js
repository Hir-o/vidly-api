const express = require('express');
const router = express.Router();
const {Movie, validate} = require('../models/movie');

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
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
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

module.exports = router;