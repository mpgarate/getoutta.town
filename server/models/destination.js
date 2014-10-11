var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var destinationSchema = new Schema({
  name: String,
  zipcode: String
});

//var Destination = mongoose.model('Destination'); 

destinationSchema.statics.loadFromFixtures = function(){
  var Destination = mongoose.model('Destination');
  Destination.remove({}, function (err) {
    if (err) console.log("error: " + err);
  });

  var destinationList = require('../fixtures/destinations.json');

  for (var i = 0; i < destinationList.length; i++){
    var destination = new Destination(destinationList[i]);
    destination.save(function(err, result){
      if (err) console.log("error: " + err);
    });
  }

}

module.exports = mongoose.model("Destination", destinationSchema);