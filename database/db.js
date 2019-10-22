require('dotenv').config();
const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DATABASE_URL,
    {
        dialectOptions: {
            ssl: true
        }
    });

module.exports = db;