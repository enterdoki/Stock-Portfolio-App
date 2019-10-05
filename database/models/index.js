const User = require("./user");
const Stock = require('./stock')

Stock.belongsTo(User);
User.hasMany(Stock);

module.exports = {
    User,
    Stock
};