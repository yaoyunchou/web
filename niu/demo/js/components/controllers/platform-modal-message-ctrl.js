/*global angular*/
(function (angular) {
	"use strict";
	angular.module('platform').controller('platformModalMessageCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
		$scope.modalOptions.moduleId;
		//close the dialog on three seconds later after display.
/*		$timeout(function () {
			$scope.closeModal(true);
		}, 3000);*/
		
		$scope.close = function close(result){
			$scope.closeModal(false, {id:1,name:'yc'});
		};
	}]);
}(angular));