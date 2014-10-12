var Destination = require('../models/destination');

module.exports.list = function(req, res) {
  Destination.find({}, function(err, results) {
    res.json(results);
  });
}