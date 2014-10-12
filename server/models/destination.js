var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WeatherPrediction = require('./weatherPrediction');
var WeatherPredictionSchema = WeatherPrediction.Schema;

var DestinationSchema = new Schema({
  name: String,
  slug: String,
  state: String,
  latitude: String,
  longitude: String,
  activities: [String],
  weatherPredictions: [WeatherPredictionSchema]
});

DestinationSchema.statics.loadFromFixtures = function() {
  var Destination = mongoose.model('Destination');
  Destination.remove({}, function(err) {
    if (err) console.log("error: " + err);
  });

  var destinationList = require('../fixtures/destinations.json');

  for (var i = 0; i < destinationList.length; i++) {
    var destination = new Destination(destinationList[i]);
    destination._id = new mongoose.Types.ObjectId;

    destination.save(function(err, result) {
      if (err) console.log("error: " + err);
    });
  }

}

Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;