require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const movies = require('./routes/movies');
const tvShows = require('./routes/tvShows');
const customers = require('./routes/customers');
const directors = require('./routes/directors');
const genres = require('./routes/genres');
const countries = require('./routes/countries');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const register = require('./routes/register');
const auth = require('./routes/auth');
const error = require('./middleware/error');
const home = require('./routes/home');
const logger = require('./middleware/logger');
const app = express();

mongoose.connect('mongodb://localhost/tv_db')
.then(() => dbDebugger('Connected to MongoDB tv_db database...'))
.catch((err) => dbDebugger("Could not connect to MongoDB tv_db", err));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
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

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

if (!process.env.JWT_KEY){
    console.error('FATAL ERROR: JWT_KEY is not defined');
    process.exit(1);
}

dbDebugger('Connected to the database...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));