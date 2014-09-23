/**
 * @author Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 *
 * The implementation of this directive has been copied from http://jsfiddle.net/vojtajina/U7Bz9/
 * so all acknowledgements should be sent to Vojta Jina (https://github.com/vojtajina)
 *
 * @module directives
 * @namespace ifcDirectives
 * @class ifcWhenScrolled
 */

(function (angular) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirectives');


	ifcDirModule.directive('ifcWhenScrolled',
		['$window', function ($window) {

			return {
				restrict: 'A',
				replace: true,
				link: function (scope, elem, attrs) {

					var raw = elem[0];
					var jQElem = angular.element(raw);
					var gaugedHeight = jQElem.css('height');


					if ((!jQElem.css('overflow')) && (!jQElem.css('overflow-y'))) {
						jQElem.css('overflow-y', 'auto');
					}


					jQElem.bind('scroll', function () {
						if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
							scope.$apply(attrs.ifcWhenScrolled);
						}
					});


					if (gaugedHeight) {
						gaugedHeight = /([\d]*)[\w]*/.exec(gaugedHeight);

						if (gaugedHeight && gaugedHeight[1]) {
							gaugedHeight = $window.parseInt(gaugedHeight[1]);
							setTimeout(getDataUntilElementHeigh, 0);

						} else {
							gaugedHeight = -1;
							setTimeout(getDataUntilWindowHeight, 0);
						}

					} else {
						gaugedHeight = -1;
						setTimeout(getDataUntilWindowHeight, 0);
					}


					function getDataUntilElementHeigh() {
						if (gaugedHeight > raw.scrollHeight) {
							scope.$apply(attrs.ifcWhenScrolled);
							setTimeout(getDataUntilElementHeigh, 0);
						}
					}


					function getDataUntilWindowHeight() {

						if (gaugedHeight !== raw.scrollHeight) {
							gaugedHeight = raw.scrollHeight;

							if (raw.scrollHeight <= $window.innerHeight) {
								scope.$apply(attrs.ifcWhenScrolled);
								setTimeout(getDataUntilWindowHeight, 0);
							} else {
								jQElem.css('height', $window.innerHeight + 'px');
							}

						} else {
							jQElem.css('height', gaugedHeight + 'px');
						}
					}
				}
			};
		}]);

}(window.angular))