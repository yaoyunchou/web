/**
 * Created by yao on 2015/11/29.
 */

(function (angular) {
    "use strict";

    angular.module('myApp').controller("phoneListCtrl",["$scope",'$q','$http',function($scope,$q,$http){
       $http({
           method:"GET",
           url:"myjs/phones.json",

       }).success(function(data){
           $scope.phones = data.data;
           console.log("数据接收成功!");
       }).error(function(data){
           console.log("服务器没给数据");
       })
    }])
})(angular)
