var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var request = require('request');

var WeatherPredictionSchema = new Schema({
  date: Date,
  icon: String,
  temperatureMin: Number,
  temperatureMax: Number,
  precipProbability: Number,
  dateFetched: Date
});

WeatherPredictionSchema.statics.refreshWeatherIfNeeded = function() {
  var WeatherPrediction = mongoose.model('WeatherPrediction');
  var Destination = mongoose.model('Destination');

  Destination.find({}, function(err, destinations) {
    if (err) return console.log("error:" + err);

    if (0 === destinations.length) {
      WeatherPrediction.refreshAll();
      return;
    }

    var secondsInADay = 86400;
    var today = new Date();

    if (today - destinations[0].dateFetched > secondsInADay) {
      WeatherPrediction.refreshAll();
    }
  });
};

WeatherPredictionSchema.statics.refreshAll = function() {
  var WeatherPrediction = mongoose.model('WeatherPrediction');
  var Destination = mongoose.model('Destination');

  Destination.find({}, function(err, results) {
    if (err) return console.log("error: " + err);
    // for each destination
    for (var i = 0; i < results.length; i++) {
      var destination = results[i];
      WeatherPrediction.refreshForDestination(destination);
    }
  });
}

WeatherPredictionSchema.statics.refreshForDestination = function(destination) {
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
  destination.weatherPredictions = [];
  destination.save();

  for (var i = 0; i < days.length; i++) {
    var dayISO = Math.floor(days[i].getTime() / 1000);

    var callToApi = baseUrl + key + '/' + destination.latitude + ',' +
      destination.longitude +
      ',' + dayISO;

    request(callToApi, function(error, response, body) {
      if (!error) {
        WeatherPrediction.createPredictionFromJson(destination, body);
      } else {
        console.log("error getting weather from api: " + error);
      }
    });
  }
}

WeatherPredictionSchema.statics.createPredictionFromJson = function(destination,
  body) {

  var WeatherPrediction = mongoose.model('WeatherPrediction');
  var json = JSON.parse(body);

  var weatherPrediction = new WeatherPrediction({
    date: new Date(json.daily.data[0].time * 1000),
    icon: json.daily.data[0].icon,
    temperatureMin: json.daily.data[0].temperatureMin,
    temperatureMax: json.daily.data[0].temperatureMax
  });

  destination.weatherPredictions.push(weatherPrediction);
  destination.save(function(err) {
    destination.updateScore();
    if (err) console.log("error: " + err);
  });

}

WeatherPrediction = mongoose.model("WeatherPrediction",
  WeatherPredictionSchema);
module.exports = WeatherPrediction;
module.exports.Schema = WeatherPredictionSchema;