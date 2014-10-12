var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require('request');

var weatherPredictionSchema = new Schema({
  icon: String,
  temperatureMin: Number,
  temperatureMax: Number,
  precipProbability: Number
});

weatherPredictionSchema.statics.refreshWeatherIfNeeded = function() {
  var WeatherPrediction = mongoose.model('WeatherPrediction');

  WeatherPrediction.find({}, function(err, results) {
    if (0 === results.length) {
      WeatherPrediction.refreshAll();
    }
  });
};

weatherPredictionSchema.statics.refreshAll = function() {
  var WeatherPrediction = mongoose.model('WeatherPrediction');
  var Destination = mongoose.model('Destination');

  Destination.find({}, function(err, results) {
    // for each destination
    for (var i = 0; i < results.length; i++) {
      var destination = results[i];
      WeatherPrediction.refreshForDestination(destination);
    }
  });
}

weatherPredictionSchema.statics.refreshForDestination = function(destination) {
  var WeatherPrediction = mongoose.model('WeatherPrediction');

  var baseUrl = 'http://api.forecast.io/forecast/';
  var key = '7889fede40cdb34e317ae4580f6a11d6';

  // determine dates for weekend weather

  var daysUntilFriday = 5 - new Date().getDay();

  var today = new Date();
  var friday = new Date(new Date().setDate(today.getDate() + daysUntilFriday));
  var saturday = new Date(new Date().setDate(friday.getDate() + 1));
  var sunday = new Date(new Date().setDate(saturday.getDate() + 1));

  var days = [friday, saturday, sunday];

  // for each day of the current or coming weekend
  for (var i = 0; i < days.length; i++) {
    var dayISO = Math.floor(days[i].getTime() / 1000);

    var callToApi = baseUrl + key + '/' + destination.latitude + ',' +
      destination.longitude +
      ',' + dayISO;

    request(callToApi, function(error, response, body) {
      if (!error) {
        WeatherPrediction.createPredictionFromJson(body);
      } else {
        console.log("error getting weather from api: " + error);
      }
    });
  }
}

weatherPredictionSchema.statics.createPredictionFromJson = function(body) {
  // katie does this

  // var temperatureMin = body.daily.temperatureMin;
  // var foo = body['daily']['temperatureMin'];
}

module.exports = mongoose.model("WeatherPrediction", weatherPredictionSchema);