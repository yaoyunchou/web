/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('bookStoreApp');
	module.controller('bookStoreListController', ['$scope', 'bookStoreDataService', function ($scope, dataService) {
		$scope.loadData = function loadData(){
			dataService.getBooks().then(function(books){
				$scope.books = books;
			});
		};
<<<<<<< HEAD
	}]);
}(angular));
/*global angular*/
(function(angular){
    "use strict";

}(angular));
=======
		
		$scope.loadData();
	}])
}(angular));
>>>>>>> 1446aa964b43bd8fce6d3e12374a8f803d604a8c
