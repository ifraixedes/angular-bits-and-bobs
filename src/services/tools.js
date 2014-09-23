/**
 * @license Ivan Fraixedes Cugat
 * License: MIT
 */

(function (angular) {
  'use strict';

  var ifcSevModule = angular.module('ifcServices');
  /**
   * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
   * characters such as '012ABC'. The reason why we are not using simply a number counter is that
   * the number string gets longer over time, and it can also overflow, where as the the nextId
   * will grow much slower, it is a string, and it will never overflow.
   *
   * @returns an unique alpha-numeric string
   */
  ifcSevModule.factory('nextUid', function () {
    var uid = ['0', '0', '0'];

    return function () {
      var index = uid.length;
      var digit;

      while (index) {
        index--;
        digit = uid[index].charCodeAt(0);
        if (digit == 57 /*'9'*/) {
          uid[index] = 'A';
          return uid.join('');
        }
        if (digit == 90  /*'Z'*/) {
          uid[index] = '0';
        } else {
          uid[index] = String.fromCharCode(digit + 1);
          return uid.join('');
        }
      }
      uid.unshift('0');
      return uid.join('');
    };
  });

  /**
   * Computes a hash of an 'obj'.
   * Hash of a:
   *  string is string
   *  number is number as string
   *  object is either result of calling $$hashKey function on the object or uniquely generated id,
   *         that is also assigned to the $$hashKey property of the object.
   *
   * @param obj
   * @returns {string} hash string such that the same input will have the same hash string.
   *         The resulting string key is in 'type:hashKey' format.
   */
  ifcSevModule.factory('hashKey', ['nextUid', function (nextUid) {
    return function (obj) {
      var objType = typeof obj,
      key;

      if (objType == 'object' && obj !== null) {
        if (typeof (key = obj.$$hashKey) == 'function') {
          // must invoke on object to keep the right this
          key = obj.$$hashKey();
        } else if (key === undefined) {
          key = obj.$$hashKey = nextUid();
        }
      } else {
        key = obj;
      }

      return objType + ':' + key;
    };
  }]);

  /**
   * A map where multiple values can be added to the same key such that they form a queue.
   * @returns {HashQueueMap}
   */
  ifcSevModule.factory('HashQueueMap', ['hashKey', function (hashKey) {
    function HashQueueMap() {}
    HashQueueMap = function () {};
    HashQueueMap.prototype = {
      /**
       * Same as array push, but using an array as the value for the hash
       */
      push: function (key, value) {
        var array = this[key = hashKey(key)];
        if (!array) {
          this[key] = [value];
        } else {
          array.push(value);
        }
      },

      /**
       * Same as array shift, but using an array as the value for the hash
       */
      shift: function (key) {
        var array = this[key = hashKey(key)];
        if (array) {
          if (array.length == 1) {
            delete this[key];
            return array[0];
          } else {
            return array.shift();
          }
        }
      },

      /**
       * return the first item without deleting it
       */
      peek: function (key) {
        var array = this[hashKey(key)];
        if (array) {
          return array[0];
        }
      }
    };

    return HashQueueMap;
  }]);

  ifcSevModule.constant('isEmptyElement', function (ele) {
    if (angular.isArray(ele) || angular.isString(ele)) {
      return (ele.length === 0) ? true : false;
    }

    if (angular.isObject(ele)) {

      for (var prop in ele) {
        if ((ele[prop] !== undefined) && (ele[prop] !== null) && (ele[prop] !== '')) {
          return false;
        }
      }

      return true;
    }

    return false;
  });


  ifcSevModule.provider('objectUpdater', function () {
    /**
     *  It doesn't check the parameters types to enhance the performance, so it expects that the
     *  parameters be two objects
     *
     * @param dest
     * @param update
     */
    var updater = function (dest, update) {
      angular.forEach(update, function (val, prop) {
        if (angular.isUndefined(dest[prop])) {
          dest[prop] = val;
        } else {
          if (angular.isObject(val) && !angular.isArray(val)) {
            updater(dest[prop], update[prop]);
          } else {
            dest[prop] = val;
          }
        }
      });
    };

    this.updater = updater;
    this.$get = function () {
      return updater;
    };
  });

  /**
   * Return a new array with the ObjectIds sorted alphabetically
   * NOTE: Method doesn't check the type of the array and expects at least the arrays contains one
   * element
   *
   * @param {Array} objectIds
   * @return {Array}
   * @throw An exception if the array has two identical ObjectIds
   */
  ifcSevModule.constant('sortObjectIds', function (objectIds) {
    var sortedObjIds = [objectIds[0]];
    var min = objectIds[0];
    var max = objectIds[0];
    var lastIdx = 0;
    var currentObjId;
    var it;
    var subIt;

    for (it = 1; it < objectIds.length; it++) {
      currentObjId = objectIds[it];

      if (currentObjId < min) {
        min = currentObjId;
        sortedObjIds.unshift(min);
      } else if (currentObjId > max) {
        max = currentObjId;
        sortedObjIds.push(max);
      } else {
        if (currentObjId < sortedObjIds[lastIdx]) {
          // min is the first element of the array, so we start at 1 position not at 0
          for (subIt = 1; subIt < lastIdx; subIt++) {
            if (currentObjId < sortedObjIds[subIt]) {
              lastIdx = subIt;
              sortedObjIds.splice(subIt, 0, currentObjId);
              break;
            }
          }
        } else if (currentObjId > sortedObjIds[lastIdx]) {
          // min is the first element of the array, so we start at 1 position not at 0
          for (subIt = lastIdx + 1; subIt < sortedObjIds.length; subIt++) {
            if (currentObjId < sortedObjIds[subIt]) {
              lastIdx = subIt;
              sortedObjIds.splice(subIt, 0, currentObjId);
              break;
            }
          }
        } else {
          throw new Error('An ObjectId: ' + currentObjId + ' is not unique in the array');
        }

      }
    }

    return sortedObjIds;
  });

  ifcSevModule.factory('limitedBroadcast', ['$exceptionHandler', function ($exceptionHandler) {
    return function ($scope, eventName, args, limit) {
      var target = $scope,
      current = target,
      next = target,
      parent = null,
      stopPropagation = false,
      event = {
        name: eventName,
        targetScope: target,
        stopPropagation: function () {stopPropagation = true;},
        preventDefault: function () {
          event.defaultPrevented = true;
        },
        defaultPrevented: false
      },
      listenerArgs,
      listeners, i, length,
      deepLimit = 0; // one level (only listeners in the scope) 

      if (args !== undefined) {
        if (angular.isNumber(args)) {
          deepLimit = args;
          listenerArgs = [event];
        } else {
          args = args.slice(0);
          args.unshift(event);
          listenerArgs = args;
        }
      } else {
        listenerArgs = [event];
      }

      if (angular.isNumber(limit)) {
        if (limit < 0) {
          throw new Errro('limitedBroacast service does not allow to infinite broacas if you need it, use the angular.$scope.$broacast');
        }
        deepLimit = limit;
      }

      function notify(current) {
        var i,
        listener,
        length;
        
        event.currentScope = current;
        listeners = current.$$listeners[eventName] || [];

        for (i = 0, length = listeners.length; i < length; i++) {
          // if listeners were deregistered, defragment the array
          if (!listeners[i]) {
            listeners.splice(i, 1);
            i--;
            length--;
            continue;
          }

          try {
            listeners[i].apply(null, listenerArgs);

            if (stopPropagation) {
              break;
            }
          } catch (e) {
            $exceptionHandler(e);
          }
        }
      }

      function notifyNextSiblings(current) {
        var sibbling = current;

        do {
          notify(sibbling);
          if (stopPropagation === false) {
            if (sibbling.$$nextSibling) {
              sibbling = sibbling.$$nextSibling;
            } else {
              return
            }
          } else {
            return;
          }
        } while (true);
      }

      function breathTraversal(target) {
        var nodes = [target];
        var node;
        var pos = 0;
        var depth = 1;

        while (pos < nodes.length) {
          node = nodes[pos++] ;
          notifyNextSiblings(node)
          node = node.$$childHead;

          while(node) {
            nodes.push(node);
            node = node.$$nextSibling;
          }
        
          //Stop if broadcast reach the depth
          if (depth === pos) {
            deepLimit--;
            depth = nodes.length;
          }

          if (deepLimit < 0) {
            return;
          }
        }
      }

      breathTraversal(current);
      return event;
    };
  }]);
}(window.angular));
