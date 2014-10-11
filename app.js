var express = require("express");
var app = express();
var mongoose = require("mongoose");

var controllers = require("./server/controllers");
var models = require("./server/models");

mongoose.connect('mongodb://localhost/getouttatown');

app.get("/", controllers.destinations.list);

app.listen(3000);