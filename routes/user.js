const express = require('express');
const bodyParser = require('body-parser');
const user = express.Router();
const User = require('../database/models/user')

user.use(bodyParser.json());

user.get('/:email', async(req, res, next) => {
    try {
        const data = await User.findOne({ where: { email: req.params.email }, attributes: {exclude: ['password']} });
        if(data) {
            res.status(200).json(data);
        } else {
            res.status(400).send('User not found.')
        }
    }catch(err) {
        res.status(400).send(err);
    }
})

// Update user balance
user.put('/:id', async(req, res, next) => {
    try {
        let data = await User.update({balance: req.body.newBalance}, {where : {id : req.params.id}});
        console.log(data);
        res.status(200).send('Updated balance.')
    } catch(err) {
        res.status(400).send(err);
    }
})

module.exports = user;