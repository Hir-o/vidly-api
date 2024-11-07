const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, validateUser } = require('../models/user');

router.get('/', auth, async(req, res) => {
    const users = await User.find().sort({_id: 1});
    res.send(users);
});

router.get('/:id', auth, async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send(`Could not find the user with id: ${id}`);
    return res.send(user);
});

router.get('/check/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.put('/:id', auth, async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = req.params.id;

    try{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    } catch(ex)
    {
        return res.status(500).send(ex.message);
    }

    const user = await User.findByIdAndUpdate(id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }, {new: true});
    
    res.send(_.pick(user, ['name', 'email']));
});

router.delete('/:id', auth, async(req, res) => {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    res.send(deletedUser);
});

module.exports = router;