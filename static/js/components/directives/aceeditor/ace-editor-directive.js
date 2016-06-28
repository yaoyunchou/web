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
	angular.module('platform').directive('platformAceEditor', ['platformModalSvc', '$http', '$templateCache', '$compile', '$rootScope',
		function (platformModalSvc, $http, $templateCache, $compile, $rootScope) {
			return {
				require: 'ngModel',
				restrict: 'A',
				scope: {
					editorHeight: '@',
					editorWidth: '@',
					mode: '@',
					theme: '@',
					fullScreenStatus: '@'
				},
				template: '<div class="ace">' +
				'               <div class="toolbar">' +
				'                   <div data-ng-click="undo()" class="toolitem undo" title="全屏显示" unselectable="on"></div>' +
				'                   <div data-ng-click="redo()" class="toolitem redo" title="后退(Ctrl+Z)" unselectable="on"></div>' +
				'                   <div data-ng-click="fullScreen()" class="toolitem fullscreen" title="前进(Ctrl+Y)" unselectable="on"></div>' +
				'               </div>' +
				'               <pre style="position: relative;width: 100%;"/>' +
				'           </div>',
				link: function (scope, element, attrs, ngModelController) {
					var loadedEditor = null, isFullScreen = scope.fullScreenStatus === 'true';

					var render = function render() {
						if (!loadedEditor) {
							return;
						}
						loadedEditor.getSession().setValue(ngModelController.$viewValue);
					};

					var resize = function resize() {
						var height = scope.editorHeight || '100%',
							width = scope.editorWidth || '100%',
							aceEditor = element.find('.ace');

						element.height(height);
						element.width(width);

						var pre = element.find('pre');
						pre.css('width', width);
						pre.css('height', parseInt(aceEditor.height()) - 28);
						loadedEditor.resize();
					};

					scope.undo = function () {
						loadedEditor.undo();
					};

					scope.redo = function () {
						loadedEditor.redo();
					};

					var displayFull = function displayFull(template) {
						var fullScope = $rootScope.$new();
						fullScope.editid = scope.$id;
						fullScope.data = ngModelController.$viewValue;

						var fullScreenElement = $compile(template)(fullScope);
						$('body').append(fullScreenElement);

						fullScope.closeDisplay = function closeDisplay(code) {
							ngModelController.$setViewValue(code);
							render();
							fullScope.$destroy();
							fullScreenElement.remove();
						};

						return {scope: fullScope, element: fullScreenElement};
					};

					scope.fullScreen = function () {
						var fullEle, parentScope = scope.$parent;
						if (!isFullScreen) {
							var template = $templateCache.get('platform-ace-fullscreen.html');
							if (!template) {
								$http.get(globals.basAppRoute + 'components/templates/platform-ace-fullscreen.html').then(function (res) {
									template = res.data;
									$templateCache.put('platform-ace-fullscreen.html', template);
									fullEle = displayFull(template);
								});
							} else {
								fullEle = displayFull(template);
							}
						} else if (parentScope && parentScope.closeDisplay) {
							parentScope.closeDisplay(ngModelController.$viewValue);
						}
						return;
					};

					//bootstrap the ace editor
					var init = function init() {
						//create ace editor and init the editor ui
						var editor = ace.edit(element.find('pre')[0]);

						editor.setTheme("ace/theme/terminal");
						editor.session.setMode("ace/mode/html");
						editor.$blockScrolling = Infinity;

						//update view value when change event called
						editor.getSession().on("change", function () {
							var newValue = editor.getSession().getValue();
							ngModelController.$setViewValue(newValue);
						});
						loadedEditor = editor;
						resize();
						render();
					};

					//update display when ngModel updated.
					ngModelController.$render = render;

					//do init after page loaded
					scope.$evalAsync(init);

					////workaround to make editor rerender after tab changed ////
					var tabElement = angular.element(element.closest('.tab-pane')), watching = false;
					if (tabElement && tabElement.length && !watching) {
						watching = true;
						var tabScope = tabElement.scope();
						var tabWatcher = tabScope.$watch('tab.active', function (val) {
							if (val) {
								render();
								setTimeout(function () {
									resize();
								});
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

					attrs.$observe('editorHeight', function () {
						resize();
					});

					attrs.$observe('editorWidth', function () {
						resize();
					});

					element.resize(function () {
						resize();
					});
				}
			};
		}]);

}(angular, ace));