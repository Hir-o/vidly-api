const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const customerSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    lastName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate:{
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: 'Please enter a valid email'
        }
    },
    phone:{
        type: String,
        trim: true,
        unique: true,
    },
    category:{
        type: String,
        required: true,
        trim: true,
        enum: ['Bronze', 'Silver', 'Gold']
    }
});

const Customer = mongoose.model('Customer', customerSchema); 

router.get('/', async(req, res) => {
    try{
        const customers = await Customer.find().sort({firstName: 1});
        res.send(customers);
    } catch (ex){
        res.status(500).send('An error occurred while fetching the customers.');
    }
});

router.get('/:id', async(req, res) => {
    const customerId = req.params.id;
    try{
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).send(`Could not find the customer with id: ${customerId}`);
        res.send(customer);
    } catch(ex){
        res.status(500).send(`An error occurred while fetching the customer with id: ${customerId}`);
    }
});

router.post('/', async(req, res) => {
    const customer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        category: req.body.category
    });

    try{
        const result = await customer.save();
        res.send(result);
    } catch(ex){
        console.error(ex.message);
        res.status(500).send('An error occurred while saving a customer.');
    }
});

router.put('/:id', async(req, res) => {
    const customerId = req.params.id;
    try{
        const customer = await Customer.findByIdAndUpdate(customerId, {
            $set:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                category: req.body.category
            }
        }, {new: true});
        res.send(customer);
    } catch(ex){
        res.status(500).send(`An error occurred while updating the customer with id: ${customerId}.`);
    }
});

router.delete('/:id', async(req, res) => {
    const customerId = req.params.id;
    try{
        const deletedCustomer = await Customer.findByIdAndDelete(customerId);
        if (!deletedCustomer) return res.status(404).send(`Could not find the customer with id: ${customerId}`);
        res.send(deletedCustomer);
    } catch(ex){
        res.status(500).send(`An error occurred while deleting the customer with id: ${customerId}`);
    }
});

module.exports = router;