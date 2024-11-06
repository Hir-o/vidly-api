const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const asyncMiddleware = require('../middleware/async');
const { Director, validateDirector } = require('../models/director');

router.get('/', async(req, res) => {
    try{
        const directors = await Director.find().sort({ firstName: 1 });
        res.send(directors);
    } catch(ex){
        res.status(500).send('An error occurred while retrieving directors.');
    }
});

router.get('/:id', async(req,  res) => {
    const id = req.params.id;
    try{
        const director = await Director.findById(id);
        if (!director) return res.status(404).send(`Could not find the director with id: ${id}`);
        res.send(director);
    } catch(ex){
        res.status(500).send(`An error occurred while fetching the director with id: ${id}`);
    }
});

router.post('/', auth, async(req, res) => {
    const { error } = validateDirector(req.body);
    if (error) res.status(400).send(error.details[0].message);

    let director = new Director({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    try{
        director = await director.save();
        res.send(director); 
    } catch (ex){
        res.status(500).send('An error occurred while saving the new director.');
    }
});

router.put('/:id', auth, async(req, res) => {
    const id = req.params.id;
    
    const { error } = validateDirector(req.body);
    if (error) res.status(400).send(error.details[0].message);

    try{
        const director = await Director.findByIdAndUpdate(id, {
            $set:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            }
        }, {new: true})

        res.send(director);
    } catch (ex){
        res.status(500).send(`An error ocurred while updating the director with id: ${id}`);
    }
});

router.delete('/:id', auth, async(req, res) => {
    const id = req.params.id;
    try{
        const deletedDirector = await Director.findByIdAndDelete(id);
        res.send(deletedDirector);
    }catch(ex){
        res.status(500).send(`An error occurred while trying to delete the director with id: ${id}`);
    }
});

module.exports = router;