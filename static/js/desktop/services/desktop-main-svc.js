(function (angular) {
	"use strict";

	angular.module('platform').factory('desktopMainSvc', ['$http', '$q',
		function ($http, $q) {

			var service = {}, loginUser, projectType=0;
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

			service.getProjectType = function getProjectType(){
				var defer = $q.defer();
				if (projectType) {
					defer.resolve(projectType);
				}
				$http({
					method: 'GET',
					url: globals.basAppRoot + 'user/findProjType',
				}).success(function (res) {
					projectType = parseInt(res.data);
					defer.resolve(projectType);
				});
				return defer.promise;
			};

			service.isPcProject = function isPcProject(){
				return projectType === 4;
			};

			service.isPoneProject = function isPoneProject(){
				return projectType === 5;
			};

			service.isResponsiveProject = function isResponsiveProject(){
				return projectType === 9;
			};

			return service;

		}]);
}(angular));