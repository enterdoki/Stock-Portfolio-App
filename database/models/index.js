const User = require("./user");
const Stock = require('./stock')
const History = require('./history');

History.belongsTo(User);
User.hasMany(History);

Stock.belongsTo(User);
User.hasMany(Stock);

module.exports = {
    User,
    Stock,
    History
};