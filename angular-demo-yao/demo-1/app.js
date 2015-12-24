/*global angular*/
(function (angular) {
    "use strict";

    angular.module('bookStoreApp', ['ui.router']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when("", "/bookstore/list");

        $stateProvider
            .state('bookstore', {
                url: '/bookstore',
                controller: 'bookStoreMainController',
                templateUrl: './partials/book-main-view.html'
            })
            .state('bookstore.list', {
                url: '/list',
                controller: 'bookStoreListController',
                templateUrl: './partials/book-list-view.html'
            })
            .state('bookstore.detail', {
                url: '/detail',
                controller: 'bookStoreDetailController',
                templateUrl: './partials/book-detail-view.html'
            });

    }]);
}(angular));