(function (angular) {
	"use strict";

	angular.module('platform').directive('platformMenu', [
		function () {
			return {
				restrict: 'A',
				scope: {
					menu: '='
				},
				require: 'ngModel',
				template:'<div class="c-menu-div"> ' +
				'               <div class="c-menu-title" data-ng-bind="navOptions.title"></div>' +
				'               <div class="c-menu-box">' +
				'				    <div data-ng-repeat="group in navOptions.groups" data-platform-menu-group data-ng-model="group"/></div>'+
				'               </div>' +
				'           </div>',
				link: function (scope, element, attrs, ctr) {
					ctr.$render = function render() {
						scope.navOptions = ctr.$viewValue;
					};


				}
			};
		}
	]);
}(angular));