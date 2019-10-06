const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const stock = express.Router();
const { User, Stock } = require("../database/models");
const session = require('express-session');
const cookieParser = require('cookie-parser');

let keys = ['3GLM456MLJ6RR4YR', '8SRTF305HEDKTYIE', '0KY0RSX3HXLPVO5X', 'J9MWKRGPKMV170R6', '032XX2KJDFX0LRHZ']
const api_key = keys[Math.floor(Math.random()*keys.length)];

stock.use(bodyParser.json());
stock.use(cookieParser());
stock.use(session({
    secret: 'stockAPI',
    resave: false,
    saveUninitialized: true
}));



// function checkSignIn(req, res, next) {
//     if (req.session.user) {
//         next();     //If session exists, proceed to page
//     } else {
//         res.status(401).send('Unauthorized user.')
//         next();  //Error, trying to access unauthorized page!
//     }
// }

stock.get('/search/:symbol', async (req, res, next) => {
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

stock.get('/search/:symbol/data', async (req, res, next) => {
    let symbol = req.params.symbol;
    try {
        let { data } = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${api_key}`);
        if (data[`Error Message`]) return 'Invalid Symbol.';
        else res.status(200).json(data['Time Series (Daily)']);
    } catch (err) {
        res.status(400).send(err);
    }
})

// Find all stocks owned by user
stock.get('/:id', async(req, res, next) => {
    try {
       const data = await User.findOne({
           where: {id: req.params.id}, include: [{model:Stock}]
       })
       if(data) {
           res.status(200).json(data);
       }
    } catch(err) {
        console.log(err);
    }
})


stock.post('/:id/buy', async(req, res, next) => {
    try {
        await Stock.create({
            symbol: req.body.symbol,
            price: req.body.price,
            quantity: req.body.quantity,
            purchaseDate: Date.now(),
            userId: req.params.id
        });
        res.status(201).send('Bought stock.');
    } catch(err) {
        console.log(err);
    }
})

stock.post('/:id/sell/:symbol/:share', async(req, res, next) => {
    try {
        await Stock.destroy({
            where:{userId:req.params.id, symbol:req.params.symbol, quantity:req.params.share}
        });
        res.status(201).send('Sold stock.');
    } catch(err) {
        console.log(err);
    }
    
})

module.exports = stock;