require('express-async-errors');
const express = require('express');
const app = express();
const logger = require('./middleware/logger');
require('./startup/logging');
require('./startup/validation');
require('./startup/routes')(app);
require('./startup/db')()
require('./startup/config')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));