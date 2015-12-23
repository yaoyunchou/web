/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.directive('platformImageLib', ['platformImageLibSvc', function (platformImageLibSvc) {

		return {
			restrict: 'A',
			scope: {
				maxCount: '@',
				multiple: '@'
			},
			require: 'ngModel',
			link: function (scope, attr, element, ngModel) {
				platformImageLibSvc.multiple = scope.multiple;
				ngModel.$render = function $render() {
					platformImageLibSvc.selectItems(ngModel.$viewValue);
				};

				scope.$on('selectedChanged', function (e, selectedItems) {
					platformImageLibSvc.selectItems(selectedItems);
					ngModel.$setViewValue(selectedItems);
				});
			},
			controller: function ($scope) {
				$scope.getImageLibSvc = function getImageLibSvc() {
					return platformImageLibSvc;
				};
			}
		};

	}]);


}(angular));