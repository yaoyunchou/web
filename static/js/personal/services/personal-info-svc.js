/**
 * Created by yinc on 2016/1/11.
 */
(function (angular) {
	"use strict";

	angular.module('personalInfoApp').factory('personalInfoSvc', ['$http', '$q', 'platformNavigationSvc', 'platformMessenger',
		function () {

			var service = {};
			service.inited = false;

			return service;

		}]);
}(angular));