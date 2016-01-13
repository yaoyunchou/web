/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('platform');
	module.factory('mobilePreviewSvc', ['$http', '$q', 'platformModalSvc', function (/*$http, $q, platformModalSvc*/) {
		var service = {};
		service.mobilePreview = function mobilePreview(content) {
			/*platformModalSvc.showModal({
				templateUrl: globals.basAppRoot + 'js/components/templates/platform-mobile-preview.html',
				size: 'sm',
				options: {
					content: content
				}
			});*/

			window.open(globals.basAppRoot+'js/template/index.html#/template-setting?uri='+encodeURIComponent(content));
		};
		return service;
	}]);
}(angular));