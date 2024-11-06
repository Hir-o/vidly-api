const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');

router.get('/', auth, async(req, res) => {
    try{
        const customers = await Customer.find().sort({firstName: 1});
        res.send(customers);
    } catch (ex){
        res.status(500).send('An error occurred while fetching the customers.');
    }
});

router.get('/:id', auth, async(req, res) => {
    const customerId = req.params.id;
    try{
        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).send(`Could not find the customer with id: ${customerId}`);
        res.send(customer);
    } catch(ex){
        res.status(500).send(`An error occurred while fetching the customer with id: ${customerId}`);
    }
});

router.post('/', auth, async(req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

router.put('/:id', auth, async(req, res) => {
    const customerId = req.params.id;

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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

router.delete('/:id', auth, async(req, res) => {
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