/**
 * Created by yinc on 2016/1/11.
 */
(function (angular) {
	"use strict";


	angular.module('personalInfoApp',['platform','common','ui.router', 'ui.bootstrap','ngStorage']).config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/personalInfo');
			$stateProvider.state('personalInfo', {
				url: '/personalInfo',
				templateUrl: 'partials/personal-info-view.html',
				controller: 'personalInfoCtrl'
			});
		}
	]);

}(angular));