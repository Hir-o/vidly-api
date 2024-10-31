const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.render('index', { title: 'Vidly', message: 'Wellcome to Vidly'}));

module.exports = router;