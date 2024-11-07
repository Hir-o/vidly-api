const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const {Customer, validateCustomer} = require('../models/customer');

router.get('/', auth, async(req, res) => {
    const customers = await Customer.find().sort({firstName: 1});
    res.send(customers);
});

router.get('/:id', auth, async(req, res) => {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).send(`Could not find the customer with id: ${customerId}`);
    res.send(customer);
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

    const result = await customer.save();
    res.send(result);
});

router.put('/:id', auth, async(req, res) => {
    const customerId = req.params.id;

    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

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
});

router.delete('/:id', auth, async(req, res) => {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);
    if (!deletedCustomer) return res.status(404).send(`Could not find the customer with id: ${customerId}`);
    res.send(deletedCustomer);
});

module.exports = router;