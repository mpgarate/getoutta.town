var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/getouttatown');

var Destination = mongoose.model('Destination', {name: String});
var destination = new Destination({name: "New York City"});


app.get("/", function(req, res){
  Destination.find(function(err, destinations) {
    res.send(destinations);
  });
});

app.listen(3000);