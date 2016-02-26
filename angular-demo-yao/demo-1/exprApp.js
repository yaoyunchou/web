/**
 * Created by yaoyc on 2015/12/24.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var exprApp = angular.module('exprApp', ['ui-router']);
	exprApp.config(['$routerProvider','$stateProvider',function($routerProvider,$stateProvider){
		$routerProvider.when('/','index.html');
		$stateProvider.state('app',{
			url:'app-list',
			templateUrl:base+'/home/index.html',
			controller:ngCtrl
		}.state())
	}]);
}(angular));