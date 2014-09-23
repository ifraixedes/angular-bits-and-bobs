(function (ifcDemo) {
  'use strict';

  ifcDemo.controller(
    'ServicesEventsCtrl', 
    ['$scope', 'limitedBroadcast', function ($scope, limitedBroadcast) {
      function clearFlags() {
        $scope.ngBroadcasting = false;
        $scope.limitedBroadcasting = false;
      }

      clearFlags();

      $scope.clearFlags = function () {
        $scope.$broadcast('clear-flags');
      };
      $scope.angularBroadcast = function () {
        $scope.$broadcast('ng-broadcasting');
      };
      $scope.limitedBroadcast = function (limit) {
        limitedBroadcast($scope, 'limited-broadcasting', limit);
      };
      
      $scope.$on('clear-flags', clearFlags);
      $scope.$on('ng-broadcasting', function () {
        $scope.ngBroadcasting = true;
      });
      $scope.$on('limited-broadcasting', function () {
        $scope.limitedBroadcasting = true;
      });
    }]
  );
}(window.angular.module('ifcDemo')))
