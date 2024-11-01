const express = require('express');
const router = express.Router();
const dbDebugger = require('debug')('app:db');
const {TvShow, validateTvShow} = require('../models/tvShow');

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
    const { error } = validateTvShow(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
    
    const { error } = validateTvShow(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

module.exports = router;