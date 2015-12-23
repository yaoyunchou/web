/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('bookStoreApp');
	module.controller('bookStoreDetailController', ['$scope', 'bookStoreDataService', function ($scope, bookStoreDataService) {
		var watcher = $scope.$watch(function(){
			return bookStoreDataService.getSelected();
		},function(newSelected){
			$scope.selectedBook = newSelected;
		});

		//destroy watch when controller unloaded.
		$scope.$on('$destroy',function(){
			watcher();
		});
	}])
}(angular));