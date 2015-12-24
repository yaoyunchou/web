(function (angular) {
    "use strict";
    var module = angular.module('bookStoreApp');
    module.controller('bookStoreListController', ['$scope', '$state', 'bookStoreDataService', function ($scope, $state, dataService) {
        $scope.loadData = function loadData() {
            dataService.getBooks().then(function (books) {
                $scope.books = books;
                $scope.selected = dataService.getSelected();
            });
        };

        $scope.selectBook = function selectBook(book) {
            dataService.selectBook(book);
            $scope.selected = book;
        };

        $scope.getRowStyle = function getRowStyle(book) {
            if (book === dataService.getSelected()) {
                return 'selectedbook';
            }
        };

        $scope.editBook = function editBook() {
            $state.go('bookstore.detail');
        };
        $scope.loadData();
        $scope.selected = dataService.getSelected();
    }]);
}(angular));