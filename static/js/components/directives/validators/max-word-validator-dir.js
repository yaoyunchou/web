/**
 * max word validator
 * Checking max word of string
 * default splitter : /[\s]+|[,，]+|[;]+/
 * useage
 * Force input can only have five valid words
 * <input type="text" max-word="5"/>
 */
(function (angular) {
	"use strict";

	angular.module('platform').directive('maxWord', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attr, ctrl) {
				if (!ctrl) {
					return;
				}
				var validator = function (value) {
					var maxWord = parseInt(attr.maxWord) || 0;
					var splitter =/[\s]+|[,，]+|[;]+|[|]+/; //line: ignore
					var count = (value || '').split(splitter).length;

					if (maxWord === 0 || count <= maxWord) {
						ctrl.$setValidity('maxword', true);
						return value;
					} else {
						ctrl.$setValidity('maxword', false);
						return value;
					}
				};

				ctrl.$formatters.push(validator);
				ctrl.$parsers.unshift(validator);

				attr.$observe('maxword', function () {
					validator(ctrl.$viewValue);
				});
			}
		};
	}]);
}(angular));