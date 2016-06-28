/*global angular*/
(function(angular){
    "use strict";
	var toolApp = angular.module('toolApp', ['platform','ui.tree','common','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox']);
	toolApp.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/online-service');
			$stateProvider.state('online-service', {
				url: '/online-service',
				templateUrl: 'partials/online-service.html',
				controller: 'onlineServiceCtrl',
				key: 'tool|online-service'
			}).state('advertising', {
				url: '/advertising',
				templateUrl: 'partials/advertising.html',
				controller: 'advertisingCtrl'
			}).state('advertising-edit', {
				url: '/advertising-edit/?id',
				templateUrl: 'partials/advertising-edit.html',
				controller: 'advertisingEditCtrl'
			}).state('keywords', {
				url: '/keywords',
				templateUrl: 'partials/keywords-service.html',
				controller: 'keywordsListCtrl'
			}).state('keywordsEdit', {
				url: '/keywordsEdit',
				templateUrl: 'partials/keywords-edit.html',
				controller: 'keyWordsEditCtrl'
			}).state('friendlyLink', {
				url: '/friendlyLink',
				templateUrl: 'partials/friendlyLink-service.html',
				controller: 'friendlyLinkListCtrl'
			}).state('friendlyLinkEdit', {
				url: '/friendlyLinkEdit',
				templateUrl: 'partials/friendlyLink-edit.html',
				controller: 'friendlyLinkEditCtrl'
			});
		}
	]);
}(angular));


