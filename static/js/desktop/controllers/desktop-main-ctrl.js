/**
 *
 */
(function (angular) {
	"use strict";

	angular.module('platform').controller('desktopMainCtrl', ['$scope', '$http', '$state', 'platformModalSvc', 'desktopMainSvc', 'platformNavigationSvc',
		function ($scope, $http, $state, platformModalSvc, desktopMainSvc, platformNavigationSvc) {
			var initLogin = function initLogin() {
				desktopMainSvc.getLoginUser().then(function (data) {
					$scope.user = data;
				});
				desktopMainSvc.getProjectType().then(function (data) {
					$scope.projectType = data;
					$scope.isPcProject = desktopMainSvc.isPcProject();
					$scope.isPhoneProject = desktopMainSvc.isPoneProject();
					$scope.isResponsiveProject = desktopMainSvc.isResponsiveProject();
					$scope.isPhoneType = desktopMainSvc.isPoneProject || desktopMainSvc.isResponsiveProject;
					$scope.isPCType = desktopMainSvc.isPcProject || desktopMainSvc.isResponsiveProject;
				});
			};

			var init = function init() {
				initLogin();
				platformNavigationSvc.reloadMenus();
			};

			$scope.exit = function exit() {
				platformModalSvc.showConfirmMessage('您确认退出系统吗?', '提示', true).then(function () {
					window.location = '/pccms/j_spring_cas_security_logout';
				});
			};

			var menuUpdated = function menuUpdated(menuOptions) {
				$scope.menuOptions = menuOptions;
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			};

			var routeUpdated = function routeUpdated(routes, currentGroup, currentRoute) {
				$scope.breadNavs = routes;
				$scope.currentGroup = currentGroup;
				$scope.currentRoute = currentRoute;
			};

			$scope.$on('$stateChangeSuccess', function () {
				platformNavigationSvc.updateRouteStatus();
			});

			$scope.$on('onMenuUpdated', function () {
				platformNavigationSvc.reloadMenus();
			});
			$scope.$on('$destroy', function () {
				platformNavigationSvc.unregisterMenuUpdated(menuUpdated);
				platformNavigationSvc.unregisterRouteUpdated(routeUpdated);
			});
			platformNavigationSvc.registerRouteUpdated(routeUpdated);
			platformNavigationSvc.registerMenuUpdated(menuUpdated);
			init();

		}]);
}(angular));