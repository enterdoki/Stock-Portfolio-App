require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());

app.get('/', (req, res, next) => {
    res.status(200).send("Default API route.");
})

app.listen(port, () => {
    console.log(`Sever listening on port: ${port}`); 
})

