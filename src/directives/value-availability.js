/**
 * @license Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 */

(function (angular) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirectives');

	/**
	 *
	 * @desciption
	 * The `ifcAvailability` sends the value of the scope variable attached to the same html tag
	 * usign `ngModel`, to the server to know if it is  valid or invalid. e.g. Invalid
	 * some time is because it is a reserved word or it has to be unique in any collection.
	 *
	 * The url to send the request is getting from the value assigned to the itself directive.
	 *
	 * This directive take the use optionally the attributes values from the html tag:
	 *  name: Used to name the parameter to send the value to check, if it doesn't exist use 'slug'
	 *  pattern: Regular expression to check the input value, if it matches the regular expression, the
	 *      the directive sends a request to the server otherwise it doesn't send a request an
	 *      invalidate the input form (if ngPattern exists, it is not needed to use that value because
	 *      the ngPattern directive is execute before this and if it fails then this directive it is not
	 *      executed)
	 *  additional-data: Evaluate the expression in the scope. Expects an object whose attributes will
	 *      be sent to the server in each request. NOTE if the object contains the an attribute with
	 *      the same name that 'name' attribute, then it will be overridden by the input value.
	 *
	 * Errors reported to angular form
	 *   unaccepted: when the slug doesn't pass the pattern
	 *   unavailable: when the server reply with not accepted slug response
	 *   uncheckable: If the request to the server return an error
	 *
	 */
	ifcDirModule.directive('ifcAvailability', ['$timeout', '$http',
		function ($timeout, $http) {
			return {
				terminal: true,
				restrict: 'AC',
				require: 'ngModel',
				link: function (scope, elem, attrs, ctrl) {
					var toPromise = false;
					var additionalDataToSend = false;
					var postData = {};
					var slugPostData = {};
					var slugParamName = 'slug';
					var validator = false;

					if (attrs.name) {
						slugParamName = attrs.name;
					}

					if (attrs.pattern) {
						validator = new RegExp(attrs.pattern);
					}

					if (attrs.additionalData) {
						additionalDataToSend = true;
						scope.$watch(attrs.additionalData, function (newVal, oldVal) {
							if (angular.isObject(newVal)) {
								postData = newVal;
								additionalDataToSend = true;
							} else {
								additionalDataToSend = false;
								postData = {};
							}
						});

						postData = scope.$eval(attrs.additionalData);
					}

					ctrl.$parsers.push(function (viewValue) {

						if (!viewValue) {
							return;
						}

						if (validator !== false) {
							if (validator.test(viewValue)) {
								ctrl.$setValidity('unaccepted', true);
							} else {
								ctrl.$setValidity('unaccepted', false);
								return;
							}
						}

						if (additionalDataToSend === true) {
							slugPostData[slugParamName] = viewValue;
							angular.extend(postData, slugPostData);
						} else {
							postData[slugParamName] = viewValue;
						}

						// if there was a previous attempt, stop it.
						if (toPromise !== false) {
							$timeout.cancel(toPromise);
						}

						// start a new attempt with a delay to keep it from getting too "chatty".
						toPromise = $timeout(function () {
							$http.post(attrs.iwaAvailability, postData)
								.success(function (data) {
									ctrl.$setValidity('uncheckable', true);

									if (data.available) {
										ctrl.$setValidity('unavailable', true);
									} else {
										ctrl.$setValidity('unavailable', false);
									}
								})
								.error(function (err, statusCode) {
									ctrl.$setValidity('uncheckable', false);
								});
						}, 500, false);

						return viewValue;

					});
				}};
		}]);

})(window.angular);