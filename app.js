require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 8080;
const app = express();
const logger = require('morgan');
const router = require('./routes/index');
const path = require('path');

app.use(logger('dev'));
app.use(cors());
app.use('/api', router);

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'))
});

app.listen(port, () => {
    console.log(`Database connected. Sever listening on port: ${port}`);
})








