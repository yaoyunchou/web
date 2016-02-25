/*global angular*/
(function(angular){
    "use strict";
	var intentionalOrderApp = angular.module('intentionalOrderApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox']);
	intentionalOrderApp.config(['$stateProvider', '$urlRouterProvider',
		function ($stateProvider, $urlRouterProvider) {
			$urlRouterProvider.otherwise('/intentional-order');
			$stateProvider.state('intentional-order', {
				url: '/intentional-order',
				templateUrl: 'partials/intentional-order.html',
				controller: 'messageCtrl',
				key: 'intentional-order|intentional-roder'
			})
				.state('catalog-config',{
					url:'/catalog-config',
					templateUrl:'partials/catalog-config.html',
					controller:'catalogConfigCtrl',
					key:'intentional-order|catalog-config'
				});

		}
	]);
}(angular));


