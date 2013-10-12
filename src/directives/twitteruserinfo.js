'use strict';

/**
 * NOTE:
 * Errors reported should be these, but how it is not possible get status code from JSONP requests
 * then we cannot distinguish between them.
 *   nonexistentUser:
 *   quotaExceeded:
 *   unspecified:
 }
 */

angular.module('iWazat.util.directives').directive('iwaTwitterUserInfo',
	['$http', '$timeout', function ($http, $timeout) {

		return {
			require: '?ngModel',
			restrict: 'EC',
			replace: true,
			template: '<input type="text"/>',
			link: function (scope, elem, attrs, ngModelCtrl) {

				var toPromise;
				var tHRegExp = /^@/;
				var parser = attrs.parser;
				var twitterHandler;

				if (parser) {
					parser = scope.$eval(parser);

					if (!angular.isFunction(parser)) {
						parser = false;
					}
				} else {
					parser = false;
				}


				elem.bind('blur keypress keyup keydown change', function () {

					var value = elem.val();

					if (tHRegExp.test(value)) {
						value = value.substr(1);
						elem.val(value);
					}


					if ((twitterHandler === value) || (value.length === 0)) {
						return;
					} else {
						twitterHandler = value;
					}

					if (toPromise) {
						$timeout.cancel(toPromise);
					}

					toPromise = $timeout(
						function () {

							if (angular.isNumber(twitterHandler)) {
								twitterHandler = 'user_id=' + twitterHandler;
							} else {
								twitterHandler = 'screen_name=' + twitterHandler;
							}

							$http.get('/api/twitter/get/users/show/' + twitterHandler).success(
								function (userData) {
									if (parser) {
										userData = parser(userData);
									}

									if (ngModelCtrl) {
										if (userData) {
											ngModelCtrl.$setViewValue(userData);
										}

										ngModelCtrl.$setValidity('unspecified', true);
									}
								})
								.error(
								function () {
									if (parser) {
										parser(null);
									}

									if (ngModelCtrl) {
										ngModelCtrl.$setViewValue(undefined);
										ngModelCtrl.$setValidity('quotaExceeded', true);
									}
								});
						}, 1000, false);
				});

			}
		};
	}]);

