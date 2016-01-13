/*global angular*/
(function (angular) {
	"use strict";

	angular.module('productApp').directive('reloadWhenClick', ['$location', '$route', function ($location, $route) {
		return {
			restrict: 'A',//仅通过属性识别
			link: function (scope, element) {
				var href = element.attr("href");
				element.on("click", function () {
					//href为#url，$location.path()的值为/url
					if (href.substring(1) === $location.path().substring(1)) {
						$route.reload();
					}
				});
			}
		};
	}]);
}(angular));