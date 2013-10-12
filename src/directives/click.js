'use strict';

angular.module('iWazat.util.directives').directive('iwaClick', ['$window', function($window) {
  return function(scope, element, attrs) {

    var isMDevice =  /(android|iphone|ipad|playbook|hp-tablet)/gi.test($window.navigator.appVersion);
	 
	 	//if(isAndroid || isIDevice || isPlaybook || isTouchPad){
    if(isMDevice){
			element.bind('touchstart', function() {
      		scope.$apply(attrs['iwaClick']);
			});
		} else {
			element.bind('click', function() {
      		scope.$apply(attrs['iwaClick']);
			});
		}
  };
}]);

