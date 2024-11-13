const mongoose = require('mongoose');
const logger = require('../middleware/logger');

module.exports = function(){
    mongoose.connect('mongodb://localhost/tv_db')
    .then(() => logger.info('Connected to MongoDB tv_db database...'));
}