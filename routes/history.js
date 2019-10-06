const express = require('express');
const bodyParser = require('body-parser');
const history = express.Router();
const History = require('../database/models/history')

history.use(bodyParser.json());

history.get('/:id', async(req, res, next) => {
    try {
        const data = await History.find({ where: { userId: req.params.id }});
        if(data) {
            res.status(200).json(data);
        } else {
            res.status(400).send('User history not found.')
        }
    }catch(err) {
        res.status(400).send(err);
    }
})

history.post('/:id', async(req, res, next) => {
    try {
        await History.create({
            type:req.body.type,
            symbol: req.body.symbol,
            price: req.body.price,
            quantity: req.body.quantity,
            transactionDate: Date.now(),
            userId: req.params.id
        })
        res.status(201).send('Added transaction history');
    }catch(err) {
        res.status(400).send(err);
    }
})


module.exports = history;