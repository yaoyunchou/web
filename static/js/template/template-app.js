(function (angular) {
	"use strict";

	angular.module('pageEditApp', ['platform', 'common', 'ui.nested.combobox']).config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider.state('template-setting', {
				url: '/template-setting?uri',
				templateUrl: globals.basAppRoute+ '/template/partials/template-edit-ctrl.html',
				controller:'pageEditContainerCtrl'
			});
		}]);
}(angular));