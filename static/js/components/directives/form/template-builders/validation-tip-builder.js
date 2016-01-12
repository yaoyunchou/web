(function (angular) {
	"use strict";

	angular.module('platform').factory('validationTipBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {};
				service.init = function init(formOptions, editorOptions, validateType) {
					baseTemplateBuilder.init(formOptions, editorOptions);
					baseTemplateBuilder.getTemplate(validateType);
				};

				service.build = function () {
					return baseTemplateBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));