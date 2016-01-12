/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').service('baseTemplateBuilder', ['$templateCache',
		function ($templateCache) {
			return function Constructor() {
				var service = {};
				service.nameFormat = 'form-%name%.html';

				service.init = function init(formOptions, editorOptions) {
					service.form = formOptions;
					service.editor = editorOptions;
					service.template = '';
					resetConfiguration();
				};

				service.getTemplate = function getTemplate(name) {
					name = service.nameFormat.replace(/%namg%/g, name);
					service.template = $templateCache.get(name);
					return service.template;
				};

				service.buildTemplateKey = function buildTemplateKey(reg, value) {
					service.template = service.template.replace(reg, value);
				};

				service.buildConfigurations = function buildConfigurations() {
					angular.forEach(service.configuration, function (config) {
						service.buildTemplateKey(config.key, config.value);
					});
					return service.template;
				};

				service.addConfiguration = function addConfiguration(configurations) {
					if (_.isUndefined(configurations)) {
						return;
					}

					if (!_.isArray(configurations)) {
						configurations = [configurations];
					}

					if ((_.isRegExp(arguments[0]) || _.isString(arguments[0])) && _.isString(arguments[1])) {
						configurations = [{key: arguments[0], value: arguments[1]}];
					}

					_.forEach(configurations, function (config) {
						service.configuration.unshift(config);//new added items has a higher priority
					});
				};

				var gridSize = 'col-md-%s% col-lg-%s% col-sm-%s% col-xs-%s%';

				var resetConfiguration = function resetConfiguration() {
					service.configuration = [
						{key: /%formName%/g, value: service.form.name || ''},
						{key: /%name%/g, value: service.editor.name || ''},
						{key: /%size%/g, value: gridSize.replace(/%s%/g, service.editor.size)},
						{key: /%type%/g, value: service.editor.type || ''},
						{key: /%model%/g, value: service.editor.model || ''},
						{key: /%directive%/g, value: service.editor.directive || ''},
						{key: /%options%/g, value: service.editor.options || ''},
						{key: /%maxLength%/g, value: service.editor.maxLength || ''},
						{key: /%maxWord%/g, value: service.editor.maxWord || ''},
						{key: /%label%/g, value: service.editor.hasLabel ? service.editor.label : ''}
					];
				};

				resetConfiguration();

				return service;
			};
		}]);
}(angular));