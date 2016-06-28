/**
 * Created by yinc on 2016/1/6.
 */
(function (angular) {
	"use strict";
	var seoApp = angular.module('seoApp',['platform','common','ui.router','ui.bootstrap','ngStorage']);
	seoApp.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/default-seo');
			$stateProvider.state('default-seo', {
				url: '/default-seo',
				templateUrl: 'partials/seo-default-view.html',
				controller: 'seoDefaultCtrl'
			}).state('alone-seo',{
				url: '/alone-seo',
				templateUrl: 'partials/seo-alone-view.html',
				controller: 'seoAloneCtrl'
			}).state('inner-seo',{
				url: '/inner-seo',
				templateUrl: 'partials/seo-inner-view.html',
				controller: 'seoInnerCtrl'
			}).state('robot-seo',{
				url: '/robot-seo',
				templateUrl: 'partials/seo-robot-view.html',
				controller: 'seoRobotCtrl'
			}).state('/sitemap',{
				url:'/sitemap',
				templateUrl:'partials/seo-sitemap-view.html',
				controller:'siteMapCtrl'
			}).state('err',{
				url:'/err',
				templateUrl:'partials/err.html'
			}).state('map',{
				url:'/map',
				templateUrl:'partials/seo-map-view.html'
			});
		}
	]);
}(angular));

