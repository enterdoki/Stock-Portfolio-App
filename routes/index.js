const router = require("express").Router();
const signinRoute = require('./signin');
const signupRoute = require('./signup');
const stockRoute = require('./stock');

router.use('/signin', signinRoute);
router.use('/signup', signupRoute);
router.use('/stock', stockRoute);

router.use((req, res, next) => {
    res.status(200).send("Default API route.");
})

module.exports = router;