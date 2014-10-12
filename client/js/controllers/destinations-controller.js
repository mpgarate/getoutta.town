app.controller('destinationsController', ['$scope', '$resource',
  function($scope, $resource) {
    var Destination = $resource('/api/destinations');

    Destination.query(function(results) {
      console.log(results);
      for (var j = 0; j < results.length; j++) {
        var weatherPredictions = results[j].weatherPredictions;
        for (var i = 0; i < weatherPredictions.length; i++) {
          var weatherPrediction = weatherPredictions[i];
          results[j].weatherPredictions[i].date = new Date(
            weatherPrediction.date)
            .toDateString();
        }
      }
      $scope.destinations = results;
    });

    $scope.destinations = [];
  }
]);