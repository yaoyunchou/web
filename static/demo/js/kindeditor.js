(function (angular) {
	"use strict";


	angular.module('demoApp').controller('kindeditorController', ['$scope', function ($scope) {

		$scope.simpleOptions = {simpleMode: true, width: 400, height: 200};
		$scope.complexOptions = {simpleMode: false, width: '95%', height: 500};

	}]);
}(angular));