/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('bookStoreApp');
	module.controller('bookStoreListController', ['$scope', 'bookStoreDataService', function ($scope, dataService) {
		$scope.loadData = function loadData(){
			dataService.getBooks().then(function(books){
				$scope.books = books;
			})
		};
		
		$scope.loadData();
	}])
}(angular));