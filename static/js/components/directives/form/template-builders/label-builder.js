(function (angular) {
	"use strict";

	angular.module('platform').factory('labelBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, requiredTemplate = baseTemplateBuilder.getTemplate('required');
				baseTemplateBuilder.getTemplate('label');
				baseTemplateBuilder.addConfiguration(/%required%/g, requiredTemplate);
				service.init = baseTemplateBuilder.init;

				service.build = function () {
					return baseTemplateBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));