(function (angular) {
	"use strict";
	angular.module('platform').service('inputTemplateBuilder',
		['baseTemplateBuilder', 'validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {
				var service = {};
				service.init = function init(formOptions, editorOptions) {
					baseTemplateBuilder.init(formOptions, editorOptions);
					baseTemplateBuilder.getTemplate('input');

					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions,'maxLengthValidateTip');
					baseTemplateBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseTemplateBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
				};

				service.build = function build() {
					return baseTemplateBuilder.buildConfigurations();
				};
				return service;
			}]);

}(angular));