var Destination = require('../models/destination');

module.exports.list = function(req, res) {
  Destination.find({}, function(err, results) {
    results.sort(function(dest1, dest2) {
      return (dest1.score > dest2.score);
    });

    for (var i = 0; i < results.length; i++) {
      results[i].weatherPredictions.sort(function(prediction1, prediction2) {
        return (prediction1.date > prediction2.date);
      });
    }

    res.json(results);
  });
}