const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');
const { Genre, validateGenre} = require('../models/genre');

router.get('/', async(req, res) => {
    try{
        const genres = await Genre.find().sort({ name: 1 });
        res.send(genres);
    } catch(ex){
        res.status(500).send('An error occurred while fetching genres.');
    }
});

router.get('/:id', asyncMiddleware(async(req, res) => {
    const id = req.params.id;
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send(`Could not find any genres with id: ${id}`);
    res.send(genre);
}));

router.post('/', auth, asyncMiddleware(async(req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    });

    const result = await genre.save();
    res.send(result);
}));

router.put('/:id', auth, asyncMiddleware(async(req, res) => {
    const id = req.params.id;

    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(id, {
        $set:{ name: req.body.name}
    }, {new: true});

    res.send(genre);
}));

router.delete('/:id', auth, asyncMiddleware(async(req, res) => {
    const id = req.params.id;
    const deletedGenre = await Genre.findByIdAndDelete(id);
    res.send(deletedGenre);
}));

module.exports = router;