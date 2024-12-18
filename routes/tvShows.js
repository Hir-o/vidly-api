const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {TvShow, validateTvShow} = require('../models/tvShow');
const {Genre, validateGenre} = require('../models/genre');
const {Country, validateCountry} = require('../models/country');

router.get('/', async (req, res) => {
    const tvShows = await TvShow.find().sort({name : 1});
    res.send(tvShows);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const tvShow = await TvShow.findById(id);
    if (!tvShow) return res.status(404).send(`TV Show with the given ID: ${id} was not found.`);
    res.send(tvShow);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateTvShow(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genres = [];
    for(genreId of req.body.genreIds){
        const genre = await Genre.findById(genreId);
        if (!genre) return res.status(404).send(`Could not find the genre with id: ${genreId} while trying to insert a new Tv Show.`);
        const { genreError } = validateGenre(genre);
        if (genreError) res.status(400).send(genreError.details[0].message);
        genres.push(genre);
    }

    let country = new Country();
    const countryId = req.body.countryId;
    if (countryId){
        country = await Country.findById(countryId);
        if (!country) return res.status(404).send(`Failed to find the country with id: ${countryId} while inserting a new movie.`);
        const { countryValidationError } = validateCountry(country);
        if (countryValidationError) return res.status(400).send(countryValidationError.details[0].message);
    }

    let tvShowObject = req.body;
    tvShowObject.genres = genres;
    tvShowObject.country = country;
    
    let tvShow = new TvShow(tvShowObject);
    tvShow = await tvShow.save();
    res.send(tvShow);
});

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    
    const { error } = validateTvShow(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genres = [];
    for(genreId of req.body.genreIds){
        const genre = await Genre.findById(genreId);
        if (!genre) return res.status(404).send(`Could not find the genre with id: ${genreId} while trying to insert a new Tv Show.`);
        const { genreError } = validateGenre(genre);
        if (genreError) res.status(400).send(genreError.details[0].message);
        genres.push(genre);
    }

    let country = new Country();
    const countryId = req.body.countryId;
    if (countryId){
        country = await Country.findById(countryId);
        if (!country) return res.status(404).send(`Failed to find the country with id: ${countryId} while inserting a new movie.`);
        const { countryValidationError } = validateCountry(country);
        if (countryValidationError) return res.status(400).send(countryValidationError.details[0].message);
    }

    let tvShowObject = req.body;
    tvShowObject.genres = genres;
    tvShowObject.country = country;

    let tvShow = await TvShow.findByIdAndUpdate(id, {
        $set: {
            name: tvShowObject.name,
            genres: tvShowObject.genres,
            rating: tvShowObject.rating,
            firstEpisodeDate: tvShowObject.firstEpisodeDate,
            country: tvShowObject.country
        }
    }, {new: true});
    res.send(tvShow);
});

router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const deletedTvShow = await TvShow.findByIdAndDelete(id);
    if (!deletedTvShow) return res.status(404).send(`The tv show with id: ${id} could not be deleted.`);
    res.send(deletedTvShow);
});

module.exports = router;