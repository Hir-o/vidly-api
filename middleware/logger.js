const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log to a file
    new winston.transports.MongoDB({ db: 'mongodb://localhost/tv_db', level: 'error' })
  ]
});

module.exports = logger;