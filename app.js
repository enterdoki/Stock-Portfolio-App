require('dotenv').config();
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();
const db = require('./database/db');
const router = require('./routes/index');

app.use(cors());
app.use('/', router);

app.get('/', (req, res, next) => {
    res.status(200).send("Default API route.");
})

// sync model schema with cloud db
db.sync({
    force:false,
})

if(db) {
    app.listen(port, () => {
        console.log(`Database connected. Sever listening on port: ${port}`); 
    })
} else {
    console.log('Database not connected.');
}






