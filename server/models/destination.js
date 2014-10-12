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
  score: Number,
  weatherPredictions: [WeatherPredictionSchema]
});

DestinationSchema.statics.updateScore = function() {
  // for katie
}

DestinationSchema.statics.loadFromFixtures = function(callbackFunction) {
  var Destination = mongoose.model('Destination');

  Destination.remove({}, function(err) {
    if (err) console.log("error: " + err);
  });

  var destinationList = require('../fixtures/destinations.json');

  var lastSave = false;
  for (var i = 0; i < destinationList.length; i++) {
    var destination = new Destination(destinationList[i]);

    if (i === destinationList.length - 1) {
      lastSave = true;
    }

    destination.save(function(err, result) {
      if (err) console.log("error: " + err);
      if (lastSave) {
        callbackFunction();
      }
    });
  }

}

Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;