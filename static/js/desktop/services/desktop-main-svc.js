/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('desktopMainSvc', ['$http', '$q', 'platformNavigationSvc', 'platformMessenger',
		function ($http, $q, navigationSvc, PlatformMessenger) {

			var service = {}, loginUser;
			service.inited = false;

			service.getLoginUser = function getLoginUser() {
				var defer = $q.defer();
				if (loginUser) {
					defer.resolve(loginUser);
				}
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/user/loginUser',
				}).success(function (res) {
					loginUser = res.data;
					defer.resolve(res.data);
				});
				return defer.promise;
			};

			return service;

		}]);
}(angular));