const express = require('express');
const router = express.Router();
const { Genre, validateGenre} = require('../models/genre');

router.get('/', async(req, res) => {
    try{
        const genres = await Genre.find().sort({ name: 1 });
        res.send(genres);
    } catch(ex){
        res.status(500).send('An error occurred while fetching genres.');
    }
});

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const genre = await Genre.findById(id);
        if (!genre) return res.status(404).send(`Could not find any genres with id: ${id}`);
        res.send(genre);
    } catch(ex){
        res.status(500).send(`An error occurred while fetching the genre with id: ${id}.`);
    }
});

router.post('/', async(req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });

    try{
        const result = await genre.save();
        res.send(result);
    } catch(ex){
        res.status(500).send('An error occurred trying to save a new genre.');
    }
});

router.put('/:id', async(req, res) => {
    const id = req.params.id;

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const genre = await Genre.findByIdAndUpdate(id, {
            $set:{ name: req.body.name}
        }, {new: true});

        res.send(genre);
    } catch(ex){
        res.status(500).send(`An error occurred trying to update the genre with id ${id}.`);
    }
});

router.delete('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const deletedGenre = await Genre.findByIdAndDelete(id);
        res.send(deletedGenre);
    } catch(ex){
        res.status(500).send(`An error occurred trying to delete the genre with id ${id}.`);
    }
});

module.exports = router;