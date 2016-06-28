/*globals KindEditor, _, _toMap, _each, kindeditor_image*/
(function (angular) {
	"use strict";

	angular.module('platform').directive('platformKindeditor', ['platformKindEditorDataSvc', function (editorService) {
		return {
			restrict: 'A',
			scope: {},
			require: 'ngModel',
			template: '<div class="kind-editor"> ' +
			'               <textarea style="visibility:hidden;"></textarea>' +
			'               <div class="word-count" >' +
			'                   <span class="err" data-ng-show="maxLengthError" style="text-align: left">录入字数不能起过<span data-ng-bind="options.maximumWords"></span>个字符</span> ' +
			'                   <span data-ng-bind="wordCount" style="min-width: 200px;float: right; text-align: right"></span>' +
			'               </div>' +
			'           </div>',
			link: function linker(scope, element, attr, ctrl) {
				var editor = {}, text = element.find('textarea');
				var _INPUT_KEY_MAP = KindEditor.toMap('8,9,13,32,46,48..57,59,61,65..90,106,109..111,188,190..192,219..222');
				var _CURSORMOVE_KEY_MAP = KindEditor.toMap('33..40');
				var _CHANGE_KEY_MAP = {};
				KindEditor.each(_INPUT_KEY_MAP, function (key, val) {
					_CHANGE_KEY_MAP[key] = val;
				});
				KindEditor.each(_CURSORMOVE_KEY_MAP, function (key, val) {
					_CHANGE_KEY_MAP[key] = val;
				});

				scope.options = scope.$parent.$eval(attr.options) || {simpleMode: attr.isSimple !== 'false'};
				scope.options.maximumWords = scope.options.maximumWords || parseInt(attr.kMaximumWords);
				scope.name = 'keditor-' + editorService.getUUID();
				var selector = 'textarea[name="' + scope.name + '"]';
				text.attr('name', scope.name);
				var options = angular.copy(scope.options);
				element.width('100%');

				if (options.simpleMode) {
					options.items = editorService.simpleItems;
					options.width = '90%';
					options.height = ((options.height || 100) + 26) + 'px';
				} else {
					options.items = editorService.complexItems;
					options.width = '100%';
					options.height = ((options.height || 450) + 61) + 'px';
				}

				options = _.extend({}, {
					resizeType: 1,
					allowPreviewEmoticons: false,
					allowImageUpload: false,
					cssPath: globals.basAppRoute + 'components/content/css/platform.css',
					colorTable: editorService.colorTable,
					htmlTags: editorService.htmlTags,
					layout: editorService.layout,
					basePath: globals.basAppRoot + 'plugin/kindeditor/',
					SimpleMode: false
				}, options);


				options.afterChange = function () {
					if (scope.options.maximumWords) {
						var strValue = this.text();
						scope.maxLengthError = scope.options.maximumWords < strValue.length;
						ctrl.$setValidity('nswmaxlength', !scope.maxLengthError);

						scope.wordCount = '(' + this.count('text') + '/' + scope.options.maximumWords + ')';
					} else {
						scope.wordCount = '';
					}

					updateData();

					if (!scope.$root.$$phase) {
						scope.$apply();
					}
					return this;
				};

				scope.$evalAsync(function () {
					editor = KindEditor.create(selector, options);
					element.find('.word-count').width(options.width);
					updateDisplay();
				});

				var updateDisplay = function updateDisplay() {
					if (_.isEmpty(editor)) {
						return;
					}
					editor.html(ctrl.$viewValue || '');
				};

				var updateData = function updateData() {
					if (editor && editor.html) {
						ctrl.$setViewValue(editor.html());
					}
				};

				ctrl.$render = function $render() {
					updateDisplay();
				};
			}
		};
	}]);
}(angular));