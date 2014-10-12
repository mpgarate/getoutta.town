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

DestinationSchema.statics.loadFromFixtures = function() {
  var Destination = mongoose.model('Destination');

  Destination.remove({}, function(err) {
    if (err) console.log("error: " + err);
  });

  var destinationList = require('../fixtures/destinations.json');

  for (var i = 0; i < destinationList.length; i++) {
    var destination = new Destination(destinationList[i]);

    destination.save(function(err, result) {
      if (err) console.log("error: " + err);
    });
  }
}

DestinationSchema.statics.updateAllScores = function() {
  Destination.find({}, function(err, destinations) {
    for (destination in destinations) {
      destination.updateScore();
    }
  });
}

DestinationSchema.methods.updateScore = function() {
  this.score = getDestinationRating(this);
  this.save(function(err) {
    if (err) console.log("error: " + err);
  });
}

function getDestinationRating(destination) {
  var score = 0;

  for (var i = 0; i < destination.weatherPredictions.length; i++) {
    var prediction = destination.weatherPredictions[i];
    score += getDailyScore(prediction);
  }

  return score;
}

function getDailyScore(prediction) {
  var score = 0;

  score += getTempScore(prediction);
  score += getIconScore(prediction);
  score += getPrecipProbScore(prediction);

  return score;
}

function getPrecipProbScore(prediction) {
  var precipProb = prediction.precipProbability;

  if (precipProb <= 10) {
    return 0;
  } else if (precipProb <= 30) {
    return 2;
  } else if (precipProb <= 60) {
    return 5;
  } else {
    return 7;
  }
}

function getIconScore(prediction) {
  var iconInput = prediction.icon;

  if (iconInput === "sleet" || iconInput === "snow") {
    return 10;
  } else if (iconInput === "fog" || iconInput === "rain") {
    return 7;
  } else if (iconInput === "wind" || iconInput === "cloudy") {
    return 5;
  } else if (iconInput === "partly-cloudy-day") {
    return 4;
  } else if (iconInput === "clear-day") {
    return 0;
  } else {
    return 0;
  }
}

function getTempScore(prediction) {
  var tempMin = prediction.temperatureMin;
  var tempMax = prediction.temperatureMax;
  var tempAverage = (tempMin + tempMax) / 2

  if (tempAverage > 70 && tempAverage <= 80) {
    return 0;
  }
  if ((tempAverage > 80 && tempAverage < 90) || (tempAverage <= 70 &&
    tempAverage > 60)) {
    return 4;
  }
  if (tempAverage <= 60 || tempAverage >= 90) {
    return 7;
  } else {
    return "score outside range";
  }

}

Destination = mongoose.model("Destination", DestinationSchema);
module.exports = Destination;