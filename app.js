const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const movies = require('./routes/movies');
const tvShows = require('./routes/tvShows');
const customers = require('./routes/customers');
const directors = require('./routes/directors');
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
app.use(logger);
app.use('/api/movies', movies);
app.use('/api/tvShows', tvShows);
app.use('/api/customers', customers);
app.use('/api/directors', directors);
app.use('/', home)
 
//console.log('Application Name: ' + config.get('name'));
//console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development'){
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

dbDebugger('Connected to the database...');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));