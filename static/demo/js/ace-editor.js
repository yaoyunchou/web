/*global  angular*/
(function (angular) {
	"use strict";
	angular.module('pageEditApp', []);
	var demoApp = angular.module('demoApp');
	demoApp.controller('aceEditorController', ['$scope', '$http', '$modal', function ($scope, $http, $modal) {
		$http.get('../demo/views/ace-editor.html').then(function (res) {
			$scope.template = res.data;
		});
	}]);
}(angular));
