/**
 * Created by yao on 2015/11/26.
 */

/*var myApp = angular.module('myApp',['$scope',function($scope){


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


 }])*/

//比较标准的写法
(function (angular) {
    "use strict";
    var module =  angular.module('myApp',['common', 'ng.webuploader', 'ui.tree', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox'])
        .run(['$rootScope','$location', function($rootScope,$location) {
            //监听路由变化,选中菜单
            $rootScope.$on('$stateChangeSuccess', function(evt, toState){
                $rootScope.menuItem = toState.name;
            });

            localStorage.setItem('isdev',$location.search()['isdev']);
        }])
        .config(["$stateProvider",'$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
            $urlRouterProvider.otherwise('btn');
            $stateProvider.state('phoneList',{
                url:"/phoneList",
                templateUrl:"myviews/phoneList.html",
                controller:"phoneListCtrl"
            })
                .state('btn', {
                    url: '/btn',
                    templateUrl: 'myviews/btn.html',
                    controller: 'btnCtrl'
                })
        }])
}(angular));
