/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.controller('platformImageLibSelectCtrl', ['$scope', function ($scope) {
		var imageLibService = $scope.$parent.getImageLibSvc();
		$scope.filter = '';
		$scope.selectedImgList = imageLibService.getSelectedItems();

		$scope.loadFilterlist = function loadFilterlist() {
			imageLibService.loadItems($scope.pageSize, $scope.bigCurrentPage, $scope.filter);
		};

		$scope.loadFilterlist();
	}]);
}(angular));