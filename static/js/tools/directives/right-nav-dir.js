/*global angular*/
(function(angular){
	"use strict";
	var toolApp = angular.module("toolApp");
	toolApp.directive("toolRightNav", function () {
		return{
			restrict:'AE',
			replace:true,
			templateUrl: globals.basAppRoute+'tools/templates/right-nav-dir.html',
			link:function(scope){
               /*初始化righ-nav*/
				scope.htmlData={
					"showTitle":scope.showTitle||true,
					"showDataList":scope.showDataList||true,
					"showAddBox":scope.showAddBox||true
				};
			}
		};
	});
}(angular));