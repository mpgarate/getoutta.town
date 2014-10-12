var DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

app.controller('destinationsController', ['$scope', '$resource',
  function($scope, $resource) {
    var Destination = $resource('/api/destinations');

    Destination.query(function(results) {
      console.log(results);
      for (var j = 0; j < results.length; j++) {
        var weatherPredictions = results[j].weatherPredictions;
        for (var i = 0; i < weatherPredictions.length; i++) {
          var date = new Date(weatherPredictions[i].date);

          results[j].weatherPredictions[
            i].date = DAY_NAMES[date.getDay()];
        }
      }
      $scope.destinations = results;
    });

    $scope.destinations = [];
  }
]);