const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Rental, validateRental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

router.get('/', async(req, res) => {
    try{
        const rentals = await Rental.find().sort({rentalStartDate: 1});
        res.send(rentals);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.get('/:id', async(req, res) => {
    const id = req.params.id;
    try{
        const rental = await Rental.findById(id);
        if (!rental) return res.status(404).send(`Could not find the rental with id: ${id}.`);
        res.send(rental);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.post('/', async(req, res) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.send(404).send(`Could not find the customer with id: ${req.body.customerId}`);

    let movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.send(404).send(`Could not find the movie with id: ${req.body.movieId}`);
    if (movie.numbersInStock === 0) return res.status(400).send(`No more movies with id: ${req.body.movieId} available in stock.`);

    const rental = new Rental({
        customer: customer,
        movie:{
            _id: movie._id,
            name: movie.name,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try{
        movie.numbersInStock--;;
        const result = await rental.save();
        await movie.save();
        res.send(result);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.put('/:id', async(req, res) => {
    const id = req.params.id;
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.send(404).send(`Could not find the customer with id: ${req.body.customerId}`);

    let movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.send(404).send(`Could not find the movie with id: ${req.body.movieId}`);

    const rental = new Rental({
        customer: customer,
        movie: {
            name: movie.name,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    if (new Date() > rental.returnDate) rental.status = 'Overdue';

    try{
        if (rental.status === 'Completed'){
            movie.numbersInStock++;
            await movie.save();
        }

        let newRental = await Rental.findByIdAndUpdate(id, {
            $set:{
                customer: rental.customer,
                movie: rental.movie,
                rentalStartDate: rental.rentalStartDate,
                rentalEndDate: rental.rentalEndDate,
                returnDate: rental.returnDate,
                status: rental.status,
            }
        }, {new: true});
        
        res.send(newRental);
    } catch(ex){
        res.status(500).send(ex.message);
    }
})

router.delete('/:id', async(req, res) => {
    const id = req.body.id;
    try{
        const rental = await Rental.findByIdAndDelete(id);
        res.send(rental);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

module.exports = router;