/**
 * Created by yao on 2015/11/26.
 */

var myApp = angular.module('myApp',['$scope',function($scope){


}])
    .factory('Item',function(){
      var items = {};
        items.name = function(){
            return [];
        }
        return items;
})
    .controller('listCtrl',["$scope",function($scoep){

    }])
    .config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
       $urlRouterProvider.otherwise("/path");
       $stateProvider.state('phoneList',{
           url:'/phoneList',
           templaterUrl:'myviews/phoneList.html',
           controller:'phoneListCtrl'
       })


    }])
(function (angular) {
    "use strict";
    var module = angular.module('bookStoreApp');
    module.controller('bookStoreListController', ['$scope', 'bookStoreDataService', function ($scope, dataService) {
        $scope.loadData = function loadData(){
            dataService.getBooks().then(function(books){
                $scope.books = books;
            })
        };
    }])

    var module = angular.module('myAapp',['$scope',function($scope){

    }])
}(angular));
