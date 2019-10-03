const express = require('express');
const bodyParser = require('body-parser');
const stock = express.Router();
const User = require('../database/models/user')

stock.get('/:symbol', async(req, res, next) => {
    try {
        
    }catch(err) {
        res.status(400).send(err);
    }
})

module.exports = stock;