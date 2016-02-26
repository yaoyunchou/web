/*global angular*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('platformModalSvc', ['$modal', '$rootScope', '$q',
		function ($modal, $rootScope, $q) {
			var service = {};
			var defaultOptions = {
				animation: true,
				backdrop: 'static', //can also be false or 'static'
				keyboard: false
			};

			var createScope = function createScope(options) {
				var scope = $rootScope.$new(true);
				if (options) {
					scope.modalOptions = options.options;
					scope.userTemplate = options.userTemplate;
				}
				return scope;
			};

			var showDialog = function showDialog(options) {
				var defer = $q.defer();
				options.scope = createScope(options);
				options.scope.closeModal = function closeModal(success, args) {
					if (success) {
						//成功返回
						defer.resolve(args);
					} else {
						defer.reject(args);
					}

					this.$close(success);
				};
				var instance = $modal.open(options);
				var isOverflow = ($('[ng-controller="desktopMainCtrl"]')[0] || $(window)[0]).clientHeight > $(window).height();
				var padding = $('html').css('padding-right');
				instance.result.then(function () {
					if(isOverflow){
						$('html').css('padding-right', padding);
						$('html').css('overflow-y', 'auto');
					}
				}, function () {
					if(isOverflow){
						$('html').css('padding-right', padding);
						$('html').css('overflow-y', 'auto');
					}
				});

				if (isOverflow) {
					$('html').css('overflow-y', 'hidden');
					$('html').css('padding-right', '17px');
				}
				setTimeout(function () {
					if (isOverflow) {
						$('.nsw.modal').css('padding-right', '17px');
					}
					if (!options.isTip) {
						if (!options.disableDrag) {
							$('.modal-dialog').draggable({
								cancel: ".modal-body,.modal-footer"
							});
						}
					}
				});
				return defer.promise;
			};

			var useCommonOptions = function useCommonOptions(options) {
				angular.forEach(defaultOptions, function (prop) {
					if (!options.hasOwnProperty(prop)) {
						options[prop] = defaultOptions[prop];
					}
				});

				options.title = options.title || '标题栏';
				options.size = options.size || 'md';
				var size;
				if (options.size === 'sm') {
					size = 496;
				} else if (options.size === 'md') {
					size = 600;
				} else if (options.size === 'xs') {
					size = 300;
				}
				/*if (!options.userTemplate) {
				 options.template = '<div data-platform-modal data-nsw-title="' + options.title + '" data-nsw-size=' + size + ' data-nsw-view="' + options.templateUrl + '"></div>';
				 options.templateUrl = null;//globals.basAppRoot + 'demo/views/ace-editor.html';
				 }*/
			};

			service.showErrorMessage = function showErrorMessage(message, title) {
				var options = {
					size: 'sm',
					userTemplate: true,
					options: {
						title: title,
						message: message,
						commitIcon: 'checkforward',
						cancelIcon: '',
						commitText: '确 定',
						cancelText: '',
						type: 'error'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-message.html'
				};
				return service.showModal(options);
			};

			service.showWarmingMessage = function showWarmingMessage(message, title) {
				var options = {
					size: 'sm',
					userTemplate: true,
					options: {
						title: title,
						message: message,
						commitIcon: 'checkforward',
						commitText: '确 定',
						type: 'warming'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-message.html'
				};
				return service.showModal(options);
			};

			service.showConfirmMessage = function showConfirmMessage(message, title) {
				var options = {
					size: 'sm',
					userTemplate: true,
					options: {
						title: title,
						message: message,
						commitIcon: 'checkforward',
						cancelIcon: 'checkcance',
						commitText: '确 定',
						cancelText: '取 消',
						type: 'confirm'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-message.html'
				};
				return service.showModal(options);
			};

			service.showSuccessMessage = function showSuccessMessage(message, title) {
				var options = {
					size: 'sm',
					userTemplate: true,
					options: {
						title: title,
						message: message,
						commitIcon: 'checkforward',
						cancelIcon: 'checkcance',
						commitText: '确 定',
						type: 'success'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-message.html'
				};
				return service.showModal(options);
			};

			service.showConfirmVCMessage = function showConfirmVCMessage(message, title) {
				var options = {
					size: 'sm',
					userTemplate: true,
					options: {
						title: title,
						message: message,
						commitIcon: 'checkforward',
						cancelIcon: 'checkcance',
						commitText: '确 定',
						cancelText: '取 消',
						type: 'confirm'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-confirm-vc-message.html'
				};
				return service.showModal(options);
			};

			service.showWarmingTip = function showWarmingTip(message) {
				var options = {
					size: 'xs',
					backdrop: false,
					userTemplate: true,
					isTip: true,
					options: {
						message: message,
						type: 'warming'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-tip.html'
				};
				return service.show(options);
			};

			service.showSuccessTip = function showWarmingTip(message) {
				var options = {
					size: 'xs',
					backdrop: false,
					userTemplate: true,
					isTip: true,
					options: {
						message: message,
						type: 'success'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-tip.html'
				};
				return service.show(options);
			};

			service.showLoadingTip = function showWarmingTip(message) {
				var options = {
					size: 'xs',
					backdrop: false,
					userTemplate: true,
					isTip: true,
					options: {
						message: message,
						type: 'loading'
					},
					templateUrl: globals.basAppRoute + 'components/templates/modals/platform-modal-tip.html'
				};
				return service.show(options);
			};

			service.showModal = function showModal(options) {
				useCommonOptions(options);
				options.backdrop = 'static';
				return showDialog(options);
			};

			service.show = function show(options) {
				useCommonOptions(options);
				options.backdrop = false;
				return showDialog(options);
			};
			return service;
		}]);

	angular.module("template/modal/window.html", []).run(["$templateCache", function ($templateCache) {
		$templateCache.put("template/modal/window.html",
			"<div tabindex=\"-1\" role=\"dialog\" class=\"nsw modal fade\" ng-class=\"{in: animate}\" style=\"display: block;	position: fixed\" ng-style=\"{'z-index': 811214 + index*10, display: 'block'}\">\n" +
			"    <div class=\"nsw modal-dialog nsw-modal-dialog\" ng-class=\"{'nsw-modal-sm': size == 'sm', 'nsw-modal-md': size == 'md','nsw-modal-lg': size == 'lg','nsw-modal-xs': size == 'xs'}\">" +
			"       <div class=\"modal-content\" modal-transclude></div>" +
			"   </div>\n" +
			"</div>");

		$templateCache.put("template/modal/backdrop.html",
			"<div style=\"display: block;width: 1388px;height: 1419px;position: absolute;left: 0px;top: 0px;\" class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
			"     ng-class=\"{in: animate}\"\n" +
			"     ng-style=\"{'z-index': 811213 + (index && 1 || 0) + index*10}\"\n" +
			"></div>\n" +
			"");
	}]);
}(angular));