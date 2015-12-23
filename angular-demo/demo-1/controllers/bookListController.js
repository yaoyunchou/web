/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('bookStoreApp');			 
	module.controller('bookStoreListController', ['$scope', 'bookStoreDataService', function ($scope,bookStoreDataService) {
		$scope.loadData = function loadData(){
			bookStoreDataService.getBooks().then(function(books){
				$scope.books = books;
			})
		};
	}])
}(angular));