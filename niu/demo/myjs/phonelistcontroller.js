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
           console.log("���ݽ��ճɹ�!");
       }).error(function(data){
           console.log("������û������");
       })
    }])
})(angular)
