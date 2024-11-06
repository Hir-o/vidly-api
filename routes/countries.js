const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const { Country, validateCountry } = require('../models/country');

router.get('/', async(req, res) => {
    try{
        const countries = await Country.find().sort('name');
        res.send(countries);
    } catch(ex){
        res.status(500).send('An error occurred while fetching countries.');
    }
});

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const country = await Country.findById(id);
        if (!country) res.status(404).send(`Could not find the country with id: ${id}.`);
        res.send(country);
    } catch(ex){
        res.status(500).send(`An error occurred while trying to get the country with id: ${id}`); 
    }
});

router.post('/', auth, async(req, res) => {
    const { error } = validateCountry(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const country = new Country(req.body);

    try{
        const result = await country.save();
        res.send(result);
    } catch(ex){
        res.status(500).send('An error occurred while trying to insert a new country.'); 
    }
});

router.put('/:id', auth, async(req, res) => {
    const id = req.params.id;
    const { error } = validateCountry(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    try{
        const country = await Country.findByIdAndUpdate(id, {
            $set:{
                name: req.body.name
            }
        }, {new: true});

        res.send(country);
    } catch(ex){
        res.status(500).send(`An error occurred while updating the country with id: ${id}`); 
    }
});

router.delete('/:id', [auth, admin], async(req, res) => {
    const id = req.params.id;
    try{
        const country = await Country.findByIdAndDelete(id);
        res.send(country);
    } catch(ex){
        res.status(500).send(`An error occurred while deleting the country with id: ${id}`); 
    }
})

module.exports = router;