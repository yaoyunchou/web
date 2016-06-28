(function (angular) {
	"use strict";

	angular.module('platform').service('platformFormDomainSvc', [function () {
		var service = {};

		var domains = {
			text: {
				template: 'input',
				type: 'text',
				size:5
			},
			name: {
				template: 'input',
				type: 'text',
				maxLength: 32,
				required: true,
				size:5
			},
			description: {
				template: 'input',
				maxLength: 32,
				type: 'text',
				required: true,
				size:5
			},
			email: {
				template: 'input',
				type: 'email',
				size:5
			},
			url: {
				template: 'input',
				type: 'url',
				size:5
			}
		};

		service.getDomainConfig = function getDomainConfig(domain) {
			return domains[domain];
		};
		return service;
	}]);
}(angular));