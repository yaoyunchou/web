/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('validationBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, errorTemplate = baseTemplateBuilder.getTemplate('error');
				baseTemplateBuilder.getTemplate('errorContainer');
				service.init = function init(formOptions, editorOptions) {
					var validatorOptions = [];
					if (editorOptions.required) {
						validatorOptions.push({type: 'required', message: '请填写%label%'});
					}
					if (editorOptions.maxLength) {
						validatorOptions.push({type: 'maxlength', message: '%label%长度为0~%maxLength%字符'});
					}
					if (editorOptions.maxWord) {
						validatorOptions.push({type: 'maxword', message: '%label%使用逗号、空格和分隔符，并不能超过%maxWord%个关键字'});
					}

					editorOptions.validates = validatorOptions;
					baseTemplateBuilder.init(formOptions, editorOptions);
				};

				service.build = function () {
					var errorTemplates = [];
					_.forEach(baseTemplateBuilder.editor.validates, function (validate) {
						var template = errorTemplate
							.replace(/%error%/g, validate.type)
							.replace(/%content%/g, validate.message);
						errorTemplates.push(template);
					});
					baseTemplateBuilder.addConfiguration(/%content%/g, errorTemplates.join('\r\n'));
					return baseTemplateBuilder.buildConfigurations();
				};

				return service;

			}]);
}(angular));