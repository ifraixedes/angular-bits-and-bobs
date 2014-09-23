(function (angular) {
  angular.module('ifcDemo', [
    'ngRoute',
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

      $routes.when('/services/events', {
        templateUrl: 'views/services/events.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section1', {
        templateUrl: 'views/services/events-section1.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section2', {
        templateUrl: 'views/services/events-section2.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section2_1', {
        templateUrl: 'views/services/events-section2-1.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section3', {
        templateUrl: 'views/services/events-section3.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section3_1', {
        templateUrl: 'views/services/events-section3-1.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.when('/services/events/section3_2', {
        templateUrl: 'views/services/events-section3-2.html',
        controller: 'ServicesEventsCtrl'
      });

      $routes.otherwise({
        redirect: '/'
      });
    }
  ]);
})(window.angular);
