
(function (ifcDemo) {

  ifcDemo.controller('MomentCtrl', ['$rootScope', '$scope',
	  function ($rootScope, $scope) {

		  $scope.dateAtLoad = new Date();
		  //$rootScope.widgetRoute = '\'/widget/two\'';
		  $rootScope.widgetRoute = '/widget/two';

  }]);


	ifcDemo.controller('WidgetOneCtrl', ['$scope', function ($scope) {

		$scope.title = 'It\'s the Widget: One';
		$scope.widgetOneGreeting = 'How are you?';

	}]);

	ifcDemo.controller('WidgetTwoCtrl', ['$scope', function ($scope) {

		$scope.title = 'It\'s the Widget: Two';
		$scope.widgetTwoGreeting = 'What\'s up?';
	}]);

})(window.angular.module('ifcDemo'));