/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('exprApp');
		module.controller("exprDemoCtrl", ["$scope", "$parse", function ($scope, $parse) {
			$scope.$watch('expr', function (newVal, oldVal, scope) {
				if (newVal !== oldVal) {
					// 用该表达式设置parseFun
					var parseFun = $parse(newVal);
					// 获取经过解析后表达式的值
					$scope.parsedValue = parseFun(scope);
				}
			});
		}])
}(angular));