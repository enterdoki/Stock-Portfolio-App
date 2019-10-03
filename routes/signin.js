const express = require('express');
const bodyParser = require('body-parser');
const signin = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/models/user')

signin.get('*', (req, res, next) => {
    res.status(200).send('This is the default sign in route. Please try a different HTTP method.');
})

signin.post('/', async(req, res, next) => {
    try {
        const user = await User.findOne({ where: { email:req.body.email }});
        if(user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let payload = { id: user.id };
                let token = jwt.sign(payload, 'stockapp');
                res.status(200).send({ user, token });
            } else {
                res.status(400).send('Password is incorrect.');
            }
        }
        else {
            res.status(400).send('Credentials invalid.');
        }
    }catch(err) {
        res.status(400).send(err);
    }
})

module.exports = signin;