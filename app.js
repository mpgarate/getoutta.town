var express = require("express");
var app = express();
var mongoose = require("mongoose");

var controllers = require("./server/controllers");
var models = require("./server/models");

mongoose.connect('mongodb://localhost/getouttatown');

models.destination.loadFromFixtures(function() {
  models.weatherPrediction.refreshWeatherIfNeeded();
});

//app.get("/", controllers.destinations.list);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/api/destinations', controllers.destinations.list);

app.listen(3000);