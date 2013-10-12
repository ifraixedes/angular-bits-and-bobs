(function (angular) {

	angular.module('ifcDemo', [
			'ifcDirectives',
			'ifcDirCollections'
		]).config([
			'$routeProvider',
			function ($routes) {

				$routes.when('/', {
					templateUrl: 'views/welcome.html',
					controller: function () {

					}
				});

				$routes.when('/widget/one', {
					templateUrl: 'views/widgets/one.html',
					controller: 'WidgetOneCtrl'
				});

				$routes.when('/widget/two', {
					templateUrl: 'views/widgets/two.html',
					controller: 'WidgetTwoCtrl'
				});

				$routes.when('/moment', {
					templateUrl: 'views/moment.html',
					controller: 'MomentCtrl'
				});


				$routes.when('/websiteinput', {
					templateUrl: 'views/websiteInput.html',
					controller: function () {}
				});

				$routes.when('/infiniteScroll', {
					templateUrl: 'views/infiniteScroll.html',
					controller: 'InfiniteScrollCtrl'
				});

				$routes.when('/collections/iterate', {
					templateUrl: 'views/collections/iterate.html',
					controller: 'IterateCollectionCtrl'
				});



				$routes.otherwise({
					redirect: '/'
				});

			}
		]);

})(window.angular);
