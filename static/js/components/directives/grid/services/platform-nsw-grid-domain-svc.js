(function (angular) {
	"use strict";

	angular.module('platform').service('platformGridDomainSvc', ['platformDomainSvc', function (platformDomainSvc) {

		var domainTypes = platformDomainSvc.domainTypes;

		return function Constructor(){
			this.domainTypes = domainTypes;
		};

	}]);
}(angular));