/*global angular*/
(function (angular) {
	"use strict";

	angular.module('productApp').controller('addXqCtrl', ['$scope', '$modalInstance','$http','$state','utils','$rootScope', function($scope,$modalInstance,$http,$state,utils,$rootScope) {

		$scope.ok = function() {

			$modalInstance.close();
		};
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.adddatafun = function () {
			var i ={"name":$scope.name,"value":''};
			$rootScope.addXqList(i);
			$scope.ok ();
		};

	}]);
}(angular));