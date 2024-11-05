const express = require('express');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');
const {Genre, validateGenre } = require('../models/genre');
const {Country, validateCountry} = require('../models/country');

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
    const {error} = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genres = [];

    if(req.body.genreIds){
        for (genreId of req.body.genreIds){
            genre = await Genre.findById(genreId);
            if (!genre) return res.status(404).send(`Failed to find the genre with id: ${genreId} while inserting a new movie.`);
            let { genreValidationError } = validateGenre(genre); 
            if (genreValidationError) return res.status(400).send(genreValidationError.details[0].message);
            genres.push(genre);
        }
    }

    let country = new Country();
    const countryId = req.body.countryId;
    if (countryId){
        country = await Country.findById(countryId);
        if (!country) return res.status(404).send(`Failed to find the country with id: ${countryId} while inserting a new movie.`);
        const { countryValidationError } = validateCountry(country);
        if (countryValidationError) return res.status(400).send(countryValidationError.details[0].message);
    }

    let movieObject = req.body;
    movieObject.genres = genres;
    movieObject.country = country;

    let movie = new Movie(movieObject);

    try{
        movie = await movie.save();
        res.send(movie);
    }catch(ex){
        res.status(500).send('An error occurred while inserting the movie.');
    }
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;

    const {error} = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genres = [];

    if (req.body.genreIds){
        for (genreId of req.body.genreIds){
            genre = await Genre.findById(genreId);
            if (!genre) return res.status(404).send(`Failed to find the genre with id: ${genreId} while trying to insert a new movie.`);
            let { genreValidationError } = validateGenre(genre); 
            if (genreValidationError) return res.status(404).send(genreValidationError.details[0].message);
            genres.push(genre);
        }
    }

    let country = new Country();
    const countryId = req.body.countryId;
    if (countryId){
        country = await Country.findById(countryId);
        if (!country) return res.status(404).send(`Failed to find the country with id: ${countryId} while inserting a new movie.`);
        const { countryValidationError } = validateCountry(country);
        if (countryValidationError) return res.status(400).send(countryValidationError.details[0].message);
    }

    let movieObject = req.body;
    movieObject.genres = genres;
    movieObject.country = country;
    
    try{
        const result = await Movie.findByIdAndUpdate(id, {
            $set: {
                name: movieObject.name,
                rating: movieObject.rating,
                releaseDate: movieObject.releaseDate,
                directors: movieObject.directors,
                genres: movieObject.genres,
                numbersInStock: movieObject.numbersInStock,
                dailyRentalRate: movieObject.dailyRentalRate,
                country: movieObject.country
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