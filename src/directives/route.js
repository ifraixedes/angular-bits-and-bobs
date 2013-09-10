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
	 * @descipton
	 * `ifc-route` observes the value assigned to itself html attribute to update the content
	 * of the html element using the controller and view specified by the provided route, so
	 * the value should be an existing route registered with `Angular $routeProvder`.
	 *
	 * For better understanding, you can think that its behaviour is the same that `ngView`, bearing
	 * in mind that it is not updated when the route change, only when its value change.
	 *
	 * This directive is useful when you need to execute different behaviour (controller + view) in
	 * some part of your layout (i.e outside `ngView` you have a widget) but it doesn't have to change
	 * for each route change (e.g. some routes use the same widget) or a part of a view which you
	 * need to change without changing the route; although this behaviour can be implemented using
	 * a controller that listen events and for each event the controller update variables and the
	 * view usign `ngTemplate`, it's cleaner to add a controller which listens the events to update
	 * the value of this directive or just using a `$rootScope` variable, so the different behaviours
	 * are implemented with a controller and view, keeping them seperated rather than all of them
	 * together in a controller or service.
	 *
	 *
	 */

	ifcDirModule.directive('ifcRoute', [
		'$http', '$templateCache', '$route', '$anchorScroll', '$compile', '$controller',
		function ($http, $templateCache, $route, $anchorScroll, $compile, $controller) {
			return {
				restrict: 'ECA',
				terminal: true,
				link: function (scope, element, attr) {
					var lastScope,
						rSpec = attr.ifcRoute,
						id = attr.id || undefined,
						onloadExp = attr.onload || false;


					// Helper function
					function destroyLastScope() {
						if (lastScope) {
							lastScope.$destroy();
							lastScope = null;
						}
					}

					// Helper function
					function clearContent() {
						element.html('');
						destroyLastScope();
					}

					// Function that run the controller/view specified by supplied route
					function update(route, params) {
						if (route.templateUrl) {
							$http.get(route.templateUrl, {cache: $templateCache}).success(function (tplContent) {
								var controller = route.controller,
									link, locals;

								destroyLastScope();

								element.html(tplContent);
								link = $compile(element.contents());
								lastScope = scope.$new();


								locals = {$scope: lastScope};

								if (angular.isObject(params)) {
									angular.forEach(params, function (pValue, pName) {
										locals[pName] = pValue;
									});
								}

								if (controller) {
									controller = $controller(controller, locals);
									element.contents().data('$ngControllerController', controller);
								}

								link(lastScope);

								lastScope.$emit('$ifcRouteContentLoaded', id);

								if (onloadExp) {
									lastScope.$eval(onloadExp);
								}

								// $anchorScroll might listen on event...
								$anchorScroll();

							}).error(function () {
									clearContent();
								});

						} else {
							clearContent();
						}
					}


					// Observe changes
					attr.$observe('ifcRoute', function (rSpec) {
						if (angular.isString(rSpec)) {
							rSpec = {
								url: rSpec
							};
						}

						if (!rSpec) {
							if (lastScope) {
								lastScope.$emit('$ifcRouteContentUnloaded', id);
							}
							return;
						}

						if ($route.routes[rSpec.url]) {
							update($route.routes[rSpec.url], rSpec.params);

						} else {
							if (lastScope) {
								lastScope.$emit('$ifcRouteContentUnloaded', id);
							}
						}
					});

					/** Code executed when the directive is linked **/
					if (rSpec) {
						if (!rSpec) {
							return;
						}

						if (angular.isString(rSpec)) {
							rSpec = {
								url: rSpec
							};
						}

						if ($route.routes[rSpec.url]) {
							update($route.routes[rSpec.url], rSpec.params);
						}
					}
					/** End linking stage **/

				}
			};
		}]);

})(window.angular);
