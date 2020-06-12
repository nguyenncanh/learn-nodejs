var mongoose = require('mongoose');

var shopSchema = new mongoose.Schema({
    shopName: String,
    idUser: String
});

var Shop = mongoose.model('Shop', shopSchema, 'shops');

module.exports = Shop