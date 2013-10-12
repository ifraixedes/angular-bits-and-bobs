
(function (ifcDemo) {

  ifcDemo.controller('MomentCtrl', ['$rootScope', '$scope',
	  function ($rootScope, $scope) {

		  $scope.dateAtLoad = new Date();
		  $rootScope.widgetRoute = '/widget/two';

  }]);

	ifcDemo.controller('InfiniteScrollCtrl', ['$scope', function ($scope) {


		$scope.elements = ['element 1','element 2','element 3'];
		var maxElements = 100;
		var numElemsToGet = 1;


		$scope.retrieveNext = function retrieveNext() {

			var limit = $scope.elements.length + 1;

			if (limit === maxElements) {
				return;
			}

			for (var e = $scope.elements.length; e < limit  + numElemsToGet; e++) {
				$scope.elements.push('element ' + (e + numElemsToGet));
			}
		};

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