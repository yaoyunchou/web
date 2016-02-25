(function (angular) {
	"use strict";
	angular.module('platform').factory(['$q',function($q) {
		var interceptor = {
			'request': function(config) {
				return config; // or $q.when(config);
			},
			'response': function(response) {
				return response; // or $q.when(config);
			},
			'requestError': function(rejection) {
				return rejection; // or new promise
			},
			'responseError': function(rejection) {
				return rejection; // or new promise
			}
		};
		return interceptor;
	}]);
}(angular));