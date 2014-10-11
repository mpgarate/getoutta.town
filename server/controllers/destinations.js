var Destination = require('../models/destination');

module.exports.create = function(req, res) {
  var destination = new Destination(req.body);
  destination.save(function(err, result){
    res.json(result);
  });
}

module.exports.list = function (req, res) {
  Destination.find({}, function(err, results) {
    res.json(results);
  });
}