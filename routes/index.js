const router = require("express").Router();
const authRoute = require('./auth');
const stockRoute = require('./stock');

router.use('/auth', authRoute);
router.use('/stock', stockRoute);

router.use((req, res, next) => {
    res.status(200).send("Default API route.");
})

module.exports = router;