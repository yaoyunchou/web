/**globals
 */
(function (angular) {
	"use strict";
	var module = angular.module('platform');
	module.directive("tagLibs",function() {
		return {
			restrict: 'A',
			replace: true,
			require:'ngModel',
			templateUrl: globals.basAppRoute + 'components/templates/tag-lib/platform-tag-libs-dir.html',
			scope: {
				beanData: '=beanData',
				ngMaxlength: '@ngMaxlength'
			},
			link:function(scope,attr,ngModel){
				scope.$evalAsync(function () {
					
				})

			}
		};
	});

}(angular));