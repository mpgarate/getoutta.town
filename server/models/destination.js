var mongoose = require('mongoose');

module.exports = mongoose.model('Destination', {
  name: String,
  zipcode: String
});
