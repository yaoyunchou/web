/*global  angular*/
(function (angular) {
	"use strict";
	var demoApp = angular.module('demoApp');
	demoApp.controller('adSelectorController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
		$http.get('../demo/json/ad-demo-data.json').then(function (res) {
			$scope.data = res.data.data;
		});
	}]);
}(angular));
