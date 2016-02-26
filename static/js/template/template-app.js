(function (angular) {
	"use strict";

	angular.module('pageEditApp', ['platform', 'common', 'ui.nested.combobox','toolApp']).config(['$stateProvider',
		function ($stateProvider) {
			$stateProvider.state('template-setting', {
				url: '/template-setting?state&isPubTpl&pageid&template',
				templateUrl: globals.basAppRoute+ '/template/partials/template-edit-ctrl.html',
				controller:'pageEditContainerCtrl'
			});
		}]);
}(angular));