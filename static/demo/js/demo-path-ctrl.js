/*global angular*/
(function (angular) {
	"use strict";
	angular.module('demoApp').controller('demoPathCtrl', ['$scope', function ($scope) {
		$scope.breadNavs =
			[
				{href: '#', name: '组件清单'},
				{href: '#', name: '路径导航'},
				{href: '#', name: '案例一'}
			];
	}]);
}(angular));