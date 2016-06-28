/*global angular*/
(function(angular){
    "use strict";
	var systemSettingsApp = angular.module('systemSettingsApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox']);
	systemSettingsApp.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/catalog-config');
			$stateProvider.state('catalog-config',{
					url:'/catalog-config',
					templateUrl:'partials/catalog-config.html',
					controller:'catalogConfigCtrl',
					key:'sys|catalog-config'
				}).state('contactInfo', {
					url: '/contactInfo',
					templateUrl: 'partials/contactInfo-service.html',
					controller: 'contactInfoCtrl'
				});;

		}
	]);
}(angular));


