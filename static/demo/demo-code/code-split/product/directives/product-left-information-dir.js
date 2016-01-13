/*global angular*/
(function (angular) {
	"use strict";

	angular.module('productApp').directive('leftInformation', function () {
		return {
			restrict: 'ACE',
			replace: true,
			link: function (scope, element) {
				element.find('button').bind('click', function () {
					$(this).hide();
					element.find('.left-info').show();
				});
			}
		};
	});
}(angular));