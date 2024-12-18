const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user');

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne( {email: req.body.email });
    if (!user) return res.status(400).send(`Invalid email or password.`);

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(`Invalid email or password.`);

    const token = user.generateAuthToken();
    res.send(token)
});

function validate(req){
    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().alphanum().required().min(6).max(255),
    });

    return schema.validate({
        email: req.email,
        password: req.password
    });
}

module.exports = router;