const express = require('express');
const bodyParser = require('body-parser');
const signup = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const User = require('../database/models/user')

signup.use(bodyParser.json());

signup.get('*', (req, res, next) => {
    res.status(200).send('This is the default sign up route. Please try a different HTTP method.');
})

signup.post('/',
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
                    balance: 5000
                });
                res.status(201).send(new_user);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    })

module.exports = signup;
