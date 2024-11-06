const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const asyncMiddleware = require('../middleware/async');
const { User, validateUser } = require('../models/user');

router.post('/', asyncMiddleware(async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( {email: req.body.email });
    if (user) return res.status(400).send(`User with email: ${req.body.email} is already registered.`);
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    const result = await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(result, ['id', 'name', 'email'])); 
}));

module.exports = router;