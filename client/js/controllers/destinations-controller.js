app.controller('destinationsController', ['$scope', '$resource', function ($scope, $resource) {
  var Destination = $resource('/api/destinations');

  Destination.query(function (results) {
    $scope.destinations = results;
  });

  $scope.destinations = [];

}]);