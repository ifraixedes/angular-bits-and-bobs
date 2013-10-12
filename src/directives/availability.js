/**
 * @license Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 *
 * @module directives
 * @namespace ifcDirectives
 * @class Availability
 */

(function (angular) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirectives');

	/**
	 *
	 * Checks the server for a value to see if a valid value to use, or invalid. e.g. Invalid
	 * some time is because it is a reserved word or it has to be unique in any collection
	 *
	 * @method {String} ifc-availability The itself directive attribute must have the url to send
	 *  the request.
	 * @method {String} name Used to name the parameter to send the value to check. @default 'value'. I
	 * @method {String} pattern Regular expression to check the input value, if it matches the regular
	 *  expression, the directive sends a request to the server otherwise it doesn't send a request an
	 *  invalidate the input form (if ngPattern exists, it is not needed to use that value because the
	 *  ngPattern directive is execute before it and if it fails then this directive it is not
	 *  executed).
	 * @method {Object} additional-data Object whose attributes will be sent to the server in each
	 *  request. If it contains an attribute with the same name that 'name' attribute, then it will
	 *  be overridden by the input value.
	 * @method {String} id The id attribute is used as prefix for the errors properties names
	 *  reported, if it doesn't exist then 'availability' is used by default.
	 *
	 * @throws errors, bear in mind that they are prepended by the `id` attribute value as commented
	 *    above:
	 *    Unaccepted: when the slug doesn't pass the pattern
	 *    Unavailable: when the server reply with not accepted slug response
	 *    Uncheckable: If the request to the server return an error
	 *
	 */
	ifcDirModule.directive('ifcAvailability', ['$timeout', '$http', function ($timeout, $http) {
		return {
			terminal: true,
			restrict: 'AC',
			require: 'ngModel',
			link: function (scope, elem, attrs, ctrl) {
				var errPrefix = (attrs.id) ? attrs.id : 'availability';
				var toPromise = false;
				var additionalDataToSend = false;
				var postData = {};
				var slugPostData = {};
				var slugParamName = 'value';
				var validator = false;

				if (attrs.name) {
					slugParamName = attrs.name;
				}

				if (attrs.pattern) {
					validator = new RegExp(attrs.pattern);
				}

				if (attrs.additionalData) {
					additionalDataToSend = true;

					attrs.$observe('additionalData', function (dataToSend) {
						if (angular.isObject(dataToSend)) {
							postData = dataToSend;
							additionalDataToSend = true;
						} else if (angular.isString(dataToSend) && (dataToSend)) {
							additionalDataToSend = false;
							postData = angular.fromJson(dataToSend);
						} else {
							postData = {};
						}
					});

					postData = attrs.additionalData;
				}

				ctrl.$parsers.push(function (viewValue) {

					if (!viewValue) {
						return;
					}

					if (validator !== false) {
						if (validator.test(viewValue)) {
							ctrl.$setValidity(errPrefix + 'Unaccepted', true);
						} else {
							ctrl.$setValidity(errPrefix + 'Unaccepted', false);
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
						$http.post(attrs.ifcAvailability, postData)
							.success(function (data) {
								ctrl.$setValidity(errPrefix + 'Uncheckable', true);

								if (data.available) {
									ctrl.$setValidity(errPrefix + 'Unavailable', true);
								} else {
									ctrl.$setValidity(errPrefix + 'Unavailable', false);
								}
							})
							.error(function (err, statusCode) {
								ctrl.$setValidity(errPrefix + 'Uncheckable', false);
							});
					}, 500, false);

					return viewValue;

				});
			}};
	}]);

}(window.angular));
