var Destination = require('../models/destination');

module.exports.list = function(req, res) {
  Destination.find({}, function(err, results) {
  	results.sort(function(dest1,dest2) {
  	 	return (dest1.score > dest2.score);
  	 });
    res.json(results);
  });
}