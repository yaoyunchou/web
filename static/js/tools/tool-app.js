/*global angular*/
(function(angular){
    "use strict";
	var toolApp = angular.module('toolApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.nested.combobox']);
	toolApp.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/online-service');
			$stateProvider.state('online-service', {
				url: '/online-service',
				templateUrl: 'partials/online-service.html',
				controller: 'onlineServiceCtrl',
				key: 'tool|online-service'
			});
		}
	]);
}(angular));


