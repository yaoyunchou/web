(function (angular) {
	"use strict";
	angular.module('platform').directive('platformForm', ['$compile', 'platformFormBuilderSvc', function ($compile, platformFormBuilderSvc) {
		return {
			restrict: 'A',
			required: 'ngModel',
			replace: true,
			//scope:true,
			/*scope: {
			 options: '=',
			 onPropertyChanged: '&'
			 },*/
			link: function (scope, element, attrs) {

				scope.formOptions = scope.$eval(attrs.options);
				scope.onPropertyChanged = scope.$eval(attrs.onPropertyChanged) || angular.noop;

				var buildForm = function buildForm() {
					if (scope.options) {
						var template = $(platformFormBuilderSvc.buildTemplate(scope.formOptions));
						element.append(template);
						$compile(template)(scope);
					}
				};

				scope.$watch('options', buildForm);
				scope.$watch(scope.formOptions.formName + '.$invalid', function (val) {
					scope.formOptions.$invalid = val;
				});

				scope.onChange = function onChanged() {
					scope.onPropertyChanged.apply(this, arguments);
					scope.formOptions.isDirty = true;
				};

				scope.formOptions.setData = function setData(data) {
					scope.formOptions.data = data;
					scope.data = data;
				};

				scope.formOptions.setData(scope.formOptions.data);
			}
		};
	}]);
}(angular));