(function (angular) {
	"use strict"
	angular.module("clock",[]).controller('clockDemoCtrl', ['$scope', '$timeout', function($scope, $timeout) {
		var upload = function() {
			$scope.clock = new Date();
			$timeout(function() {
				$scope.$apply(upload)
			}, 1000)
		}
		upload();

	}])

}(angular));