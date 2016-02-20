(function (angular) {
	"use strict";
	angular.module('platform').controller('aceEditorFullScreenCtrl', ['$scope', function ($scope) {
		$scope.width = $(window).width();
		$scope.height = $(window).height();
	}]);
}(angular));