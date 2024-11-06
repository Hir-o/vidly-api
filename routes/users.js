const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { User, validateUser } = require('../models/user');

router.get('/', auth, async(req, res) => {
    try{
        const users = await User.find().sort({_id: 1});
        res.send(users);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.get('/:id', auth, async(req, res) => {
    const id = req.params.id;
    try{
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).send(`Could not find the user with id: ${id}`);
        return res.send(user);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.get('/check/me', auth, async(req, res) => {
    try{
        console.log(req);
        const user = await User.findById(req.user._id).select('-password');
        res.send(user);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.put('/:id', auth, async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const id = req.params.id;

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    try{
        const user = await User.findByIdAndUpdate(id, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        }, {new: true});
        
        res.send(_.pick(user, ['name', 'email']));
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

router.delete('/:id', auth, async(req, res) => {
    const id = req.params.id;
    try{
        const deletedUser = await User.findByIdAndDelete(id);
        res.send(deletedUser);
    } catch(ex){
        res.status(500).send(ex.message);
    }
});

module.exports = router;