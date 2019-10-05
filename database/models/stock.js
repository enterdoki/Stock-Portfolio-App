const Sequelize = require('sequelize');
const db = require('../db');

const Stock = db.define('stock', {
    symbol : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        required: true
    },
    quantity : {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        required:true,
    },
    purchaseDate: {
        type: Sequelize.DATE,
        allowNull: false,
        required:true,
    }
},{
    timestamps:false
});

module.exports = Stock;