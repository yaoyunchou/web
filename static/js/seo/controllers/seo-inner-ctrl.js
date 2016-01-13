/**
 * Created by yinc on 2016/1/7.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoInnerCtrl',['$scope','$http','seoInnerSvc',function($scope,$http,seoInnerSvc){
		seoInnerSvc.showInnerList().then(function(data){
			$scope.innerList = data;
		});
	}]);
}(angular));
