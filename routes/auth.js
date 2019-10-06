const express = require('express');
const bodyParser = require('body-parser');
const auth = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('../database/models/user')


auth.use(bodyParser.json());
auth.use(cookieParser());
auth.use(session({
    secret: 'stockAPI',
    resave: false,
    saveUninitialized: true
}));

auth.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            if (bcrypt.compareSync(req.body.password, user.password)) {
                let payload = { email: user.email };
                let token = jwt.sign(payload, 'stockAPI');
                req.session.user = user;
                res.status(200).send({ user, token });
            } else {
                res.status(400).send('Password is incorrect.');
            }
        }
        else {
            res.status(400).send('Credentials invalid.');
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

auth.post('/register',
    [check('email').isEmail(),
    check('firstname').isLength({ min: 1 }),
    check('lastname').isLength({ min: 1 }),
    ], async (req, res, next) => {

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(422).json({ errors: errors.array() })
            }
            else {
                let hash_password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
                let new_user = await User.create({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash_password,
                    balance: 5000.00
                });
                req.session.user = new_user;
                res.status(201).send(new_user);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    })

auth.get('/logout', (req, res, next) => {
    req.session.destroy;
    res.status(200).send("Logged out.");
})
  
auth.get('*', (req, res, next) => {
    res.status(200).send('This is the default auth route. Please try a different HTTP method.');
})
module.exports = auth;
