/*globals _*/
(function (angular) {
	"use strict";
	angular.module('platform').factory('radioBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, radioTemplate = baseTemplateBuilder.getTemplate('radio');
				baseTemplateBuilder.getTemplate('radioGroup');
				service.init = baseTemplateBuilder.init;

				service.build = function () {
					var optionTemplates = [];
					_.forEach(baseTemplateBuilder.editor.options, function (option) {
						var template = radioTemplate
							.replace(/%value%/g, option.value)
							.replace(/%label%/g, option.label);
						optionTemplates.push(template);
					});
					baseTemplateBuilder.addConfiguration(/%content%/g, optionTemplates.join('\r\n'));
					return baseTemplateBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));

