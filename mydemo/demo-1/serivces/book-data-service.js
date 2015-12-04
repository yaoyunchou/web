/*global angular*/
(function (angular) {
	"use strict";

	angular.module('bookStoreApp').factory('bookStoreDataService', ['$http', '$q', function ($http, $q) {
		var factory = {};
		var list, selected;
		factory.getBooks = function (){
			var defer = $q.defer();
			if(!list){
				$http({
					method:'get',
					url:'http://127.0.0.1:8020/htdocs/web/mydemo/demo-1/content/json/books.json'
				}).then(function(res){
					list = res.data;
					factory.selectBook(list[0]);
					defer.resolve(list);
				})
			}else{
				defer.resolve(list);
			}
			return defer.promise;
		};

		factory.addBook = function addBook(code, name, author, publisher){
			list.push({
				code:code,
				name:name,
				author:author,
				publisher:publisher
			});
		};

		factory.selectBook = function selectBook(book){
			selected = book;
		};

		factory.getSelected = function getSelected(){
			return selected;
		};
		return factory;
	}]);
}(angular));