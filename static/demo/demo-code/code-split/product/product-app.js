/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('productApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox']);
	module.config(['$stateProvider', '$urlRouterProvider',
				function ($stateProvider, $urlRouterProvider) {

					$urlRouterProvider.otherwise('/list');
					$stateProvider.state('list', { //产品列表
						url: '/list',///list?moduleId&name&page
						templateUrl: 'list.html',
						controller: 'listCtrl'
					}).state('addproduct', {//产品录入
								url: '/add-product',
								templateUrl: 'edit.html',
								controller: 'editCtrl'
							})
							.state('addproductclass', {//产品分类录入
								url: '/add-productClass',
								templateUrl: 'addClassify.html',
								controller: 'addClassifyCtrl'
							})
							.state('productclass-Edit', {
								url: '/classifyEdit?id&isLink&moduleId&name&page',
								templateUrl: 'addClassify.html',
								controller: 'addClassifyCtrl'
							})


							.state('productClassList', {//产品列表
								url: '/class-list',
								templateUrl: 'classify.html',
								controller: 'classifyCtrl'
							})
							.state('product-edit', {
								url: '/product-edit?id&isLink&moduleId&name&page',
								templateUrl: 'edit.html',
								controller: 'editCtrl'
							})
							.state('add', {
								url: "/product-add",
								templateUrl: 'edit.html',
								controller: 'editCtrl'
							})
				}
			]);
}(angular));







