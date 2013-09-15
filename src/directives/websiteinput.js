/**
 * @license Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 */

(function (angular) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirectives');

	/**
	 * @description
	 * `ifc-website-input` parse the text introduced in an input box and test if it may be a url
	 * web site. The introduced url may specify one of the web protocols (http or https) or not.
	 * The directive always returns to the model (variable specified by ng-model directive) the url
	 * with the protocol part, when the introduced value is a right web site url, so it adds the
	 * `http` protocol when the input url lacks of protocol.
	 *
	 * The directive report an error to the ngModelCtrl labeled websiteUrl, which is a boolean with
	 * true value when the input text is a wrong url
	 */
	ifcDirModule.directive('ifcWebsiteInput', [
		function () {
			return {
				restrict: 'EA',
				require: 'ngModel',
				link: function (scope, elem, attrs, ngModelCtrl) {

					var wsRegExp = /(?:(?:(https?):\/\/)?(?:[a-zA-Z]+[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*(?:\.[a-zA-Z]{2,}))(?:\/[\w$\-@.&+!*"'(),]*|%[0-9a-fA-F]*)*(?:\?(?:[\w$\-@.&+!*"'(),]|%[0-9a-fA-F])+)?(?:#(?:.*))?)/;

					ngModelCtrl.$parsers.push(parserAndFormatterFn);
					ngModelCtrl.$formatters.push(parserAndFormatterFn);

					function parserAndFormatterFn(value) {

						var urlChecker = wsRegExp.exec(value);

						if (urlChecker === null) {
							if ((!attrs.required) && (!value)) {
								ngModelCtrl.$setValidity('websiteUrl', true);
							} else {
								ngModelCtrl.$setValidity('websiteUrl', false);
							}
							return null;

						} else {
							ngModelCtrl.$setValidity('websiteUrl', true);

							if ((urlChecker[1] === undefined) && (value.length > 0)) {
								return 'http://' + value;
							} else {
								return value;
							}
						}

					}
				}
			}
		}
	]);
}(window.angular));