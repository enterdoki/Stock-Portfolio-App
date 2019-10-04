const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const stock = express.Router();
const User = require('../database/models/user')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const api_key = process.env.API_KEY

stock.use(cookieParser());
stock.use(session({
    secret: 'stockAPI',
    resave: false,
    saveUninitialized: true
}));

// Heavy weight data, don't use for now.
const getSymbol = async (symbol) => {
    try {
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${api_key}`);
        if (data[`Error Message`]) return 'Invalid Symbol.';
        else
            return Object.values(data['Time Series (Daily)'])[0];
    } catch (err) {
        return err;
    }
}

// function checkSignIn(req, res, next) {
//     if (req.session.user) {
//         next();     //If session exists, proceed to page
//     } else {
//         res.status(401).send('Unauthorized user.')
//         next();  //Error, trying to access unauthorized page!
//     }
// }

stock.get('/:symbol', async (req, res, next) => {
    let symbol = req.params.symbol;
    try {
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${api_key}`);
        if (data[`Error Message`]) res.status(400).send('Invalid Symbol.');
        else
            res.status(200).json(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = stock;