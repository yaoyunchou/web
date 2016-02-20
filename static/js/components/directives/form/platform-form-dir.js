(function (angular) {
	"use strict";
	angular.module('platform').directive('platformForm', ['$compile', 'platformFormBuilderSvc', function ($compile, platformFormBuilderSvc) {
		return {
			restrict: 'A',
			required: 'ngModel',
			replace: true,
			link: function (scope, element, attrs) {

				scope.formOptions = scope.$eval(attrs.options) || {};
				scope.onPropertyChanged = scope.$eval(attrs.onPropertyChanged) || angular.noop;

				attrs.$observe('onPropertyChanged', function () {
					scope.onPropertyChanged = scope.$eval(attrs.onPropertyChanged) || angular.noop;
				});

				var buildForm = function buildForm() {
					if (scope.formOptions) {
						scope.lookups = scope.formOptions.lookups;
						var template = $(platformFormBuilderSvc.buildForm(scope.formOptions));
						element.html('');
						element.append(template);
						$compile(template)(scope);
					}
				};

				scope.$watch(scope.formOptions.name + '.$invalid', function (val) {
					scope.formOptions.$invalid = val;
				});

				scope.onChange = function onChanged() {
					scope.onPropertyChanged.apply(this, arguments);
					scope.formOptions.isDirty = true;
				};

				var init = function init(){
					scope.formOptions.setData = function setData(data) {
						scope.formOptions.data = data;
						scope.data = data;
						scope[scope.formOptions.name].$setPristine(true);
					};

					scope.formOptions.setData(scope.formOptions.data);
				};

				if(scope.formOptions && scope.formOptions.name) {
					attrs.$observe('options', function () {
						scope.formOptions = scope.$eval(attrs.options) || {};
						init();
						buildForm();
					});

					scope.$watch('formOptions.rows',function(){
						buildForm();
					});

					scope.$watch('formOptions.data',function(newVal){
						scope.formOptions.setData(newVal);
					});

					init();
				}
			}
		};
	}]);
}(angular));