/**
 * @license Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 */

(function (angular, moment) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirectives');


	/**
	 * @descipton
	 * `ifc-rt-from-now` update the html tag element value, with the value returned by moment.fromNow
	 * function whenever the date date assigned to the scope vatiabled which is bounded to this
	 * directive by `ngModel` requires, due the value should be different from the previous one
	 *
	 */
	ifcDirModule.directive('ifcRtFromNow', ['$timeout',
		function ($timeout) {

			return {
				restrict: 'A',
				require: 'ngModel',
				replace: true,
				template: '',
				link: function (scope, elem, attrs, ngModelCtrl) {
					var promise;

					var render = ngModelCtrl.$render = function (fromTimeout) {

						if (fromTimeout !== true) {
							refreshTimeout(promise);
						}

						elem.html(moment(ngModelCtrl.$modelValue).fromNow());
					}


					function refreshTimeout(lastPromise) {

						var diff;

						if (lastPromise) {
							$timeout.cancel(lastPromise);
						}

						diff = moment().diff(moment(ngModelCtrl.$modelValue));

						if (diff < 45000) {
							promise = $timeout(refreshTimeout, 45000 - diff, false);
						} else if (diff < 90000) {
							promise = $timeout(refreshTimeout, 90000 - diff, false);
						} else if (diff < 2700000) {
							promise = $timeout(refreshTimeout, 60000 - (diff % 6000), false);
						} else if (diff < 4050000) {
							promise = $timeout(refreshTimeout, 4050000 - diff, false);
						} else if (diff < 79200000) {
							promise = $timeout(refreshTimeout, 3600000 - (diff % 3600000), false);
						} else if (diff < 129600000) {
							promise = $timeout(refreshTimeout, 129600000 - diff, false);
						}

						render(true);
					}


					scope.$on('$destroy', function () {
						$timeout.cancel(promise)
					});

				}
			}

		}
	]);

})(window.angular, window.moment);
