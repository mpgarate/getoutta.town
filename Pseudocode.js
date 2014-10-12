var express = require('express');
var app = express();
var request = require('request');

function locationString(latitude, longitude) {
	
	var callToAPI = 'http://api.forecast.io/forecast/'
	+ '7889fede40cdb34e317ae4580f6a11d6/' + latitude + ',' + longitude + ',1413070092';
	
	request(callToAPI, function(error, response, body) {
		if (!error) { 
			console.log(body)
		}
		else {
			console.log("error is: " + error)
		}	
	});
}

locationString(latitude, longitude);
