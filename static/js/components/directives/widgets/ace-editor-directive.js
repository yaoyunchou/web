/**
 * author: liang can lun
 * date: 2015-11-27
 */
/*global ace, angular*/
(function (angular, ace) {
	"use strict";

	/**
	 * angular directive for code edit
	 *
	 */
	angular.module('platform').directive('platformAceEditor', [function () {
		return {
			require: 'ngModel',
			restrict: 'A',
			scope: {
				editorHeight: '@',
				editorWidth: '@',
				mode: '@',
				theme: '@'
			},
			template: '<pre style="position: relative;"/>',
			link: function (scope, element, attrs, ngModelController) {
				var loadedEditor = null,
					height = scope.editorHeight || '100%',
					width = scope.editorWidth || '100%'
					/*mode = scope.mode || 'html',
					theme = scope.theme || 'twilight*/;

				var render = function render() {
					if (!loadedEditor) {
						return;
					}
					loadedEditor.getSession().setValue(ngModelController.$viewValue);
				};

				//bootstrap the ace editor
				var init = function init() {
					//get editor element, and set width & height
					var preElement = element.find('pre');
					preElement.css('width', width);
					preElement.css('height', height);
					preElement.css('position', 'relative');

					//create ace editor and init the editor ui
					var editor = ace.edit(preElement[0]);

					editor.setTheme("ace/theme/terminal");
					editor.session.setMode("ace/mode/html");
					editor.$blockScrolling = Infinity;

					//update view value when change event called
					editor.getSession().on("change", function () {
						var newValue = editor.getSession().getValue();
						ngModelController.$setViewValue(newValue);
					});
					loadedEditor = editor;
					render();
				};

				//update display when ngModel updated.
				ngModelController.$render = render;

				//do init after page loaded
				scope.$evalAsync(init);

				////workaround to make editor rerender after tab changed ////
			 	var tabElement = angular.element(element.closest('.tab-pane')),watching = false;
				if(tabElement && tabElement.length &&!watching){
					watching = true;
					var tabScope = tabElement.scope();
					var tabWatcher = tabScope.$watch('tab.active',function(val){
						if(val){
							render();
						}
					});

					tabScope.$on('$destroy', function () {
						tabWatcher();
					});
				}

				//clear directive
				scope.$on('$destroy', function () {
					if (loadedEditor) {
						loadedEditor.destroy();
						loadedEditor.container.remove();
					}
				});


			}
		};
	}]);

}(angular, ace));