const router = require("express").Router();
const authRoute = require('./auth');
const stockRoute = require('./stock');
const userRoute = require('./user');
const historyRoute = require('./history');

router.use('/auth', authRoute);
router.use('/stock', stockRoute);
router.use('/user', userRoute);
router.use('/history', historyRoute);


router.use((req, res, next) => {
    res.status(200).send("Default API route.");
})

module.exports = router;