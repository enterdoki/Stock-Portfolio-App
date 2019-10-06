const Sequelize = require('sequelize');
const db = require('../db');

const History = db.define('history', {
    type: {
        type: Sequelize.STRING,
        allowNull:false,
        require:true
    },
    symbol : {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        required: true
    },
    quantity : {
        type: Sequelize.FLOAT,
        allowNull: false,
        required:true,
    },
    transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
        required:true,
    }
},{
    timestamps:false
});

module.exports = History;