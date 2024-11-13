const express = require('express');
const movies = require('../routes/movies');
const tvShows = require('../routes/tvShows');
const customers = require('../routes/customers');
const directors = require('../routes/directors');
const genres = require('../routes/genres');
const countries = require('../routes/countries');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const register = require('../routes/register');
const auth = require('../routes/auth');
const home = require('../routes/home');
const error = require('../middleware/error');
const helmet = require('helmet');

module.exports = function(app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/movies', movies);
    app.use('/api/tvShows', tvShows);
    app.use('/api/customers', customers);
    app.use('/api/directors', directors);
    app.use('/api/genres', genres);
    app.use('/api/countries', countries);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/register', register);
    app.use('/api/auth', auth);
    app.use('/', home)
    app.use(error);

    app.use(express.static('public'));
    app.use(helmet());
}