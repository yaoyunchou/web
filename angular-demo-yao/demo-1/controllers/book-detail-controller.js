(function (angular) {
    "use strict";

    var module = angular.module('bookStoreApp');
    module.controller('bookStoreDetailController', ['$scope', '$state', 'bookStoreDataService', function ($scope, $state, dataService) {
        $scope.selectedBook = dataService.getSelected();
        $scope.goList = function goList() {
            $state.go('bookstore.list')
        };
    }]);
}(angular));