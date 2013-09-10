(function (ifcDemo) {

	ifcDemo.controller('IterateCollectionCtrl',
		['$scope', '$timeout', function ($scope, $timeout) {

			function initUsers() {
				usersIndex = {
					a: 5,
					b: 3,
					c: 2,
					d: 1,
					e: 4,
					f: 0
				};

				$scope.usersListIfcRepeat = [
					{
						id: 'f',
						name: 'Rocky Balboa',
						points: 120
					},
					{
						id: 'd',
						name: 'Ivan Drago',
						points: 105
					},
					{
						id: 'c',
						name: 'Kicking your ass',
						points: 20
					},
					{
						id: 'b',
						name: 'Mike Tyson',
						points: 80
					},
					{
						id: 'e',
						name: 'Sparring me',
						points: 63
					},
					{
						id: 'a',
						name: 'Get rid of me',
						points: 95
					}
				];

				$scope.usersListNgRepeat = [
					{
						id: 'f',
						name: 'Rocky Balboa',
						points: 120
					},
					{
						id: 'd',
						name: 'Ivan Drago',
						points: 105
					},
					{
						id: 'c',
						name: 'Kicking your ass',
						points: 20
					},
					{
						id: 'b',
						name: 'Mike Tyson',
						points: 80
					},
					{
						id: 'e',
						name: 'Sparring me',
						points: 63
					},
					{
						id: 'a',
						name: 'Get rid of me',
						points: 95
					}
				];
			}

			function walkingDelete(id) {
				var u;

				for (u = 0; u < $scope.usersListNgRepeat.length; u++) {
					if (id === $scope.usersListNgRepeat[u].id) {
						$scope.usersListNgRepeat.splice(u, 1);
						return true;
					}
				}

				return false;
			}

			function fastDelete(id) {
				var pos = usersIndex[id];

				if (angular.isUndefined(pos)) {
					return false;
				} else {
					$scope.usersListIfcRepeat[pos] = null;
					return true;
				}
			}

			var usersIndex;
			var toPromise;

			initUsers();

			$scope.initUsers = initUsers;

			$scope.elementRemoved = '';

			$scope.removeElement = function removeElement() {

				var key = $scope.keyOfElemToRemove;

				if (toPromise) {
					$scope.elementRemoved = '';
					$timeout.cancel(toPromise);
				}

				if (angular.isUndefined(key) || (key === '')) {
					$scope.elementRemoved = false;

				} else {
					if (walkingDelete(key) && fastDelete(key)) {
						$scope.elementRemoved = 'removed';
					} else {
						$scope.elementRemoved = 'failed'
					}

				}

				toPromise = $timeout(function () {
					$scope.elementRemoved = '';
				}, 2000);

			};

		}]);

})(window.angular.module('ifcDemo'));