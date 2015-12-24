/*global angular*/
(function (angular) {
    "use strict";

    var module = angular.module('bookStoreApp');
    module.factory('bookStoreDataService', ['$http', '$q', function ($http, $q) {
        var service = {};
        var list, selected;
        service.getBooks = function () {
            var defer = $q.defer();
            if (!list) {
                $http({
                    method: 'get',
                    url: './content/json/books.json'
                }).then(function (res) {
                    list = res.data;
                    service.selectBook(list[0]);
                    defer.resolve(list);
                });
            } else {
                defer.resolve(list);
            }
            return defer.promise;
        };

        service.addBook = function addBook(code, name, author, publisher) {
            list.push({
                code: code,
                name: name,
                author: author,
                publisher: publisher
            });
        };

        service.selectBook = function selectBook(book) {
            selected = book;
        };

        service.getSelected = function getSelected() {
            return selected;
        };
        return service;
    }]);
}(angular));