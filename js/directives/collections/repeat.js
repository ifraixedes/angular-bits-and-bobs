/**
 * @author Ivan Fraixedes Cugat
 * (c) 2013
 * License: MIT
 * It codes is strongly ported from  AngularJS library licensed under MIT by Google Inc.
 *
 * @module directives
 * @namespace ifcDirCollections
 * @class Repeat
 */

(function (angular) {
	'use strict';

	var ifcDirModule = angular.module('ifcDirCollections');

	/**
	 * `ifcRepeat` is almost the same that ngRepeat but ignore the `null` and `undefined` elements
	 * into the collection so they are ignore as if they aren't into it
	 *
	 * @method ifcRepeat
	 * @param {String} ifcRepeat the same string time that accept ngRepeat directive
	 * @requires HashQueueMap (service)
	 *
	 */
	ifcDirModule.directive('ifcRepeat',
		['HashQueueMap', function (HashQueueMap) {

			return {
				transclude: 'element',
				priority: 1000,
				terminal: true,
				compile: function (element, attr, linker) {
					return function (scope, iterStartElement, attr) {
						var expression = attr.ifcRepeat;
						var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
							lhs, rhs, valueIdent, keyIdent;
						if (!match) {
							throw Error("Expected ngRepeat in form of '_item_ in _collection_' but got '" +
								expression + "'.");
						}
						lhs = match[1];
						rhs = match[2];
						match = lhs.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);
						if (!match) {
							throw Error("'item' in 'item in collection' should be identifier or (key, value) " +
								"but got '" + lhs + "'.");
						}
						valueIdent = match[3] || match[1];
						keyIdent = match[2];

						// Store a list of elements from previous run. This is a hash where key is the item from the
						// iterator, and the value is an array of objects with following properties.
						//   - scope: bound scope
						//   - element: previous element.
						//   - index: position
						// We need an array of these objects since the same object can be returned from the iterator.
						// We expect this to be a rare case.
						var lastOrder = new HashQueueMap();

						scope.$watch(function ngRepeatWatch(scope) {
							var index, length,
								collection = scope.$eval(rhs),
								cursor = iterStartElement,     // current position of the node
							// Same as lastOrder but it has the current state. It will become the
							// lastOrder on the next iteration.
								nextOrder = new HashQueueMap(),
							//arrayLength,
								childScope,
								key, value, // key/value of iteration
								array,
								last,       // last object information {scope, element, index}
								numNoValues = 0; // Incremented one null or undefined is found when walking the array


							if (!angular.isArray(collection)) {
								// if object, extract keys, sort them and use to determine order of iteration over obj props
								array = [];
								for (key in collection) {
									if (collection.hasOwnProperty(key) && key.charAt(0) != '$') {
										array.push(key);
									}
								}
								array.sort();
							} else {
								array = collection || [];
							}

							// we are not using forEach for perf reasons (trying to avoid #call)
							for (index = 0, length = array.length; index < length; index++) {
								key = (collection === array) ? index : array[index];
								value = collection[key];

								if ((value === undefined) || (value === null)) {
									numNoValues++;
									continue;
								}

								last = lastOrder.shift(value);

								if (last) {
									// if we have already seen this object, then we need to reuse the
									// associated scope/element
									childScope = last.scope;
									nextOrder.push(value, last);

									if (index === last.index) {
										// do nothing
										cursor = last.element;
									} else {
										// existing item which got moved
										last.index = index;
										// This may be a noop, if the element is next, but I don't know of a good way to
										// figure this out,  since it would require extra DOM access, so let's just hope that
										// the browsers realizes that it is noop, and treats it as such.
										cursor.after(last.element);
										cursor = last.element;
									}
								} else {
									// new item which we don't know about
									childScope = scope.$new();
								}

								childScope[valueIdent] = value;
								if (keyIdent) childScope[keyIdent] = key;

								childScope.$index = index - numNoValues;
								childScope.$first = (index === numNoValues);
								//childScope.$last = (index === (arrayLength - 1));
								// Update the last state of the element, if it is the last then set when the loop ends
								childScope.$last = false;
								childScope.$middle = !(childScope.$first);

								if (!last) {
									linker(childScope, function (clone) {
										cursor.after(clone);
										last = {
											scope: childScope,
											element: (cursor = clone),
											index: index
										};
										nextOrder.push(value, last);
									});
								}
							}

							if (length > 0) {
								// Set the flag $last to the last element
								last.scope.$last = true;
								last.scope.$middle = false;

								// Set the a fake length of the array, which is the number of effective values
								collection.$length = length - numNoValues;
							}

							//shrink children
							for (key in lastOrder) {
								if (lastOrder.hasOwnProperty(key)) {
									array = lastOrder[key];
									while (array.length) {
										value = array.pop();
										value.element.remove();
										value.scope.$destroy();
									}
								}
							}

							lastOrder = nextOrder;
						});
					};
				}
			};
		}]);
}(window.angular));