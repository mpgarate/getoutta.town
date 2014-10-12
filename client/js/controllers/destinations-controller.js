app.controller('destinationsController', ['$scope', '$resource',
  function($scope, $resource) {
    var Destination = $resource('/api/destinations');

    Destination.query(function(results) {
      console.log(results);
      var weatherPredictions = results[0].weatherPredictions;
      for (var i = 0; i < weatherPredictions.length; i++) {
        var weatherPrediction = weatherPredictions[i];
        results[0].weatherPredictions[i].date = new Date(weatherPrediction.date);
      }
      console.log(results);
      $scope.destinations = results;
    });

    $scope.destinations = [];
  }
]);