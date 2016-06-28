/*global baidu, module*/
(function () {
	"use strict";

	var exportObj, inBroswer = false;
	if (typeof exports === 'undefined') {
		exportObj = window;
		inBroswer = true;
	} else {
		exportObj = module.exports;
	}

	var appRoot = 'http://localhost:8083/pccms/';

	//when the location is invalid, replace it with the default location.
	if (exportObj.location && appRoot.toLowerCase().indexOf(window.location.origin.toLowerCase()) === -1) {
		appRoot = window.location.origin + '/pccms/';
	}
	exportObj.globals = {
		basAppRoot: appRoot,
		basAppRoute: appRoot + 'js/',
		basImagePath:'http://192.168.4.160:8080/nswcms/',
		defaultImg:appRoot+ 'img/nsw.png',
		debug: true,
		spaMode: false
	};

}());

/*global angular*/
(function (angular) {
	"use strict";
	angular.module('platform',['ui.router', 'ui.bootstrap','ngStorage']);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').service('platformDomainSvc'[function(){
		var domainTypes = {
			fastEdit:{},
			text:{},
			url:{
				regexp:'(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?',
			},
			email:{},
			qq:{},
			mobile:{},
			skype:{},
			title:{},
			shortTitle:{},
			status:{},
			check:{},
			radio:{},
			money:{},
			number:{},
			date:{},
			datetime:{},
			year:{}
		};

		return function Constructor(){
			this.domainTypes = domainTypes;
		};
	}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').service('platformFormDomainSvc', [function () {
		var service = {};

		var domains = {
			text: {
				template: 'input',
				type: 'text',
				size:5
			},
			textarea: {
				template: 'textarea',
				rows:3,
				size:5
			},
			htmleditor: {
				template: 'htmleditor',
				isSimple:true,
				size:5
			},
			select:{
				template: 'select',
				key:'id',
				display:'name',
				size:5
			},
			name: {
				template: 'input',
				type: 'text',
				maxLength: 32,
				required: true,
				size:5
			},
			description: {
				template: 'input',
				maxLength: 32,
				type: 'text',
				required: true,
				size:5
			},
			email: {
				template: 'input',
				type: 'email',
				size:5,
				validates:[
					{type: 'email', message: '请填写正确的邮件地址!'}
				]
			},
			url: {
				template: 'input',
				type: 'url',
				size:5,
				validates:[
					{type: 'url', message: '请填写正确的链接地址(http://)!'}
				]
			},
			radio: {
				template: 'radio',
				key:'id',
				display:'name',
				size:5
			},
			checkbox: {
				template: 'checkbox',
				key:'id',
				display:'name',
				size:5
			},
			singleimage: {
				template: 'singleimage',
				key:'id',
				display:'name',
				size:5
			},
			adlib: {
				template: 'adlib',
				key:'id',
				display:'name',
				size:5
			}
		};

		service.getDomainConfig = function getDomainConfig(domain) {
			return domains[domain];
		};
		return service;
	}]);
}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').factory(['$q',function($q) {
		var interceptor = {
			'request': function(config) {
				return config; // or $q.when(config);
			},
			'response': function(response) {
				return response; // or $q.when(config);
			},
			'requestError': function(rejection) {
				return rejection; // or new promise
			},
			'responseError': function(rejection) {
				return rejection; // or new promise
			}
		};
		return interceptor;
	}]);
}(angular));
/*global angular, _*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.service('platformImageLibSvc', ['$http', function ($http) {
		return function Constructor() {
			var self = this;
			var loadedItems = [], selectedItems = [], removedItems = [], createdItems = [];
			self.exts = 'gif,jpg,jpeg,bmp,png';

			self.getItems = function getItems() {
				return loadedItems;
			};

			self.addCreatedItems = function addCreatedItems(newItems) {
				if (!angular.isArray(newItems) && angular.isObject(newItems) && newItems.hasOwnProperty('_id')) {
					newItems = [newItems];
				}
				angular.forEach(newItems, function (newItem) {
					loadedItems.push(newItem);
					createdItems.push(newItem);
				});
			};

			self.removeItems = function removeItems(items) {
				if (angular.isString(items)) {
					items = _.find(loadedItems, {'_id': items});
				}
				if (!angular.isArray(items) && angular.isObject(items) && items.hasOwnProperty('_id')) {
					items = [items];
				}

				angular.forEach(items, function (removed) {
					if (angular.isString(removed)) {
						removed = _.find(loadedItems, {'_id': removed});
					}

					if (_.find(createdItems, {_id: removed._id})) {
						_.remove(createdItems, {_id: removed._id});
					}

					if (angular.isDefined(removed)) {
						removedItems.push(removed);
						_.remove(loadedItems, {'_id': removed._id});
					}
				});
			};

			self.clearItems = function clearItems() {
				loadedItems.length = 0;
				createdItems.length = 0;
				removedItems.length = 0;
				self.clearSelected();
			};

			self.selectItems = function selectItems(newSelectedItems) {
				if (angular.isString(newSelectedItems)) {
					newSelectedItems = _.find(loadedItems, {'_id': newSelectedItems});
				}
				if (!angular.isArray(newSelectedItems) && angular.isObject(newSelectedItems) && newSelectedItems.hasOwnProperty('_id')) {
					newSelectedItems = [newSelectedItems];
				}
				angular.forEach(newSelectedItems, function markItemAsSelected(item) {
					var selectedItem;
					if (angular.isString(item)) {
						selectedItem = _.find(loadedItems, {_id: item});
					}
					else if (angular.isObject(item) && item.hasOwnProperty('_id')) {
						selectedItem = item;
						if (!_.find(loadedItems, {_id: selectedItem._id})) {
							loadedItems.push(selectedItem);
						}
					}
					if (angular.isDefined(selectedItem)) {
						selectedItems.push(selectedItem);
					}
				});
			};

			self.getSelectedItems = function getSelectedItems() {
				return selectedItems;
			};

			self.clearSelected = function clearSelected() {
				selectedItems.length = 0;
			};

			self.isItemSelected = function isItemSelected(item) {
				if (angular.isString(item)) {
					return !!_.find(loadedItems, {_id: item});
				} else if (angular.isObject(item) && item.hasOwnProperty('_id')) {
					return !!_.find(loadedItems, {_id: item._id});
				}
				return false;
			};

			self.loadItems = function loadItems(pageSize, pageNum, filter) {
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/file/list',
					params: {'pageNum': pageNum, 'pageSize': pageSize, 'fileName': filter}
				}).then(function (res) {
					_.concat(loadedItems, res.data.list);
				}, function (error) {
					alert(error);
				});
			};

			self.upLoadItems = function upLoadItems() {
			};
		};
	}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').factory('platformKindEditorDataSvc',
		['nswmultiimagePluginSvc', 'spechartsPluginSvc', 'selectmodularPluginSvc', 'nswPreviewPluginSvc', 'reformatPluginSvc', 'nswPreviewPhonePluginSvc',
			function (nswmultiimagePluginSvc, spechartsPluginSvc, selectmodularPluginSvc, nswPreviewPluginSvc, reformatPluginSvc, nswPreviewPhonePluginSvc) {
				var service = {};
				service.simpleItems = ['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'forecolor', 'hilitecolor', 'fontname', 'fontsize',
					'|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'link', 'fullscreen'];
				service.complexItems = ['source', '|', 'selectmodular', '|', 'undo', 'redo', '|', 'cut', 'copy', 'paste',
					'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
					'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'subscript',
					'superscript', 'clearhtml', 'reformat', 'selectall', 'fullscreen', '/',
					'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
					'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'nswmultiimage',
					'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
					'anchor', 'link', 'unlink', '|', 'spechars', '|', 'nswpreview', 'nswpreviewphone'
				];
				service.htmlTags = {
					font: ['color', 'size', 'face', '.background-color', 'class'],
					span: ['style', 'class', 'id', 'onclick'],
					div: ['class', 'align', 'style', 'id', 'data-src', 'fn'],
					table: ['class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'style', 'align', 'bgcolor', 'id', 'frame', 'rules', 'summary'],
					'td,th': ['class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor', 'style', 'id'],
					a: ['class', 'href', 'target', 'name', 'style', 'title', 'id', 'onclick'],
					'img,section': ['src', 'width', 'height', 'id', 'border', 'alt', 'title', 'align', 'style', 'class', 'templocation', 'sid', "columns", "cssname", "orderby", "sqlwhere", "columnname", "columnnameurl", "selectcount", 'controltype', 'datatype', 'controid', 'cwidth', 'cheight', 'oid', '/', 'onclick'],
					hr: ['class', '/'],
					br: ['/'],
					'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6': ['align', 'style', 'class', 'id', 'onclick'],
					'strong,b,sub,sup,em,i,u,strike,tr': ['style', 'class', 'id'],
					dl: ['class', 'style', 'id'],
					dt: ['class', 'style', 'id'],
					dd: ['class', 'style', 'id'],
					ul: ['class', 'style', 'id', 'data-src', 'fn'],
					li: ['class', 'style', 'id'],
					iframe: ['src', 'width', 'height', 'style', 'frameborder', 'data-ke-src', 'class'],
					style: ['type', 'oid'],
					script: ['src', 'type', 'oid'],
					//针对视频
					object: ['codebase', 'classid', 'width', 'height'],
					param: ['name', 'value'],
					embed: ['src', 'allowfullscreen', 'loop', 'style', 'autostart', 'flashvars', 'quality', 'pluginspage', 'type', 'width', 'height', 'wmode', 'align', 'allowscriptaccess']
				};
				service.colorTable = [
					['#000000', '#E56600', '#64451D', '#DFC5A4', '#FFE500', '#009900', '#006600', '#99BB00'],
					['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE', '#666666', '#6666ff'],
					['#E53333', '#993300', '#333300', '#003300', '#003366', '#000080', '#333399', '#333333'],
					['#800000', '#FF6600', '#808000', '#008080', '#0000FF', '#666699', '#CCFFFF', '#CCFFCC'],
					['#FF0000', '#FF9900', '#99CC00', '#339966', '#33CCCC', '#3366FF', '#800080', '#99CCFF'],
					['#FF00FF', '#FFCC00', '#FFFF00', '#00FF00', '#00FFFF', '#00CCFF', '#993366', '#CC99FF'],
					['#FF99CC', '#FFCC99', '#FFFF99', '#808080', '#999999', '#C0C0C0', '#CCCCCC', '#FFFFFF']
				];
				service.layout = '<div class="container">' +
					'       <div class="other container_top dn"></div>' +
					'       <div class="tab container_top dn"></div>' +
					'       <div class="reversals dn"></div>' +
					'       <div class="toolbar"></div>' +
					'       <div class="edit"></div>' +
					'       <div class="position container_bottom"></div>' +
					'       <div class="btns container_bottom dn"></div>' +
					'       <div class="statusbar"></div>' +
					'   </div>';

				service.getUUID = function getUUID() {
					return String(new Date().getTime());
				};

				nswmultiimagePluginSvc.init();
				spechartsPluginSvc.init();
				selectmodularPluginSvc.init();
				nswPreviewPluginSvc.init();
				reformatPluginSvc.init();
				nswPreviewPhonePluginSvc.init();
				return service;
			}]);

}(angular));
/*global angular*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('platformMessenger', [function () {
		return function PlatformMessenger() {
			var service = this || {}, handlers = [];
			service.register = function register(handler) {
				handlers.push(handler);
			};

			service.unregister = function unregister(handler) {
				var index = handlers.indexOf(handler);
				if (index >= 0) {
					handlers.splice(index, 1);
				}
			};

			service.fire = function fire() {
				var args = arguments;
				angular.forEach(handlers, function (handler) {
					handler.apply(this, args);
				});
			};
		};
	}]);
}(angular));
/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('platform');
	module.factory('mobilePreviewSvc', [function () {
		var service = {};
		service.mobilePreview = function mobilePreview(pageid,state,isPubTpl) {
			state = state ||'view';
			isPubTpl = _.isUndefined(isPubTpl)?true:isPubTpl;
			window.open(globals.basAppRoot+'js/template/index.html#/template-setting?' +
				'pageid='+pageid+
				'&state='+state+
				'&isPubTpl='+isPubTpl);
		};
		return service;
	}]);
}(angular));
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
/*global _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('platformNavigationSvc', ['$state', '$http', '$q', 'platformMessenger', '$localStorage',
			function ($state, $http, $q, PlatformMessenger, $localStorage) {

			var service = {}, currentMenu, currnetGroup, menus, currentRoute,
				menuUpdated = new PlatformMessenger(),
				routeUpdated = new PlatformMessenger();

			service.routes = [];
			service.setRoutes = function setRoutes(currentGroup, currentRoute, routes) {
				var home = {name: '首页', href: '/js/personal/index.html#/personalInfo'};
				home.menu = home;
				home.group = currentGroup;
				service.routes = [home];
				angular.forEach(routes, function (route) {
					service.routes.push(route);
				});

				routeUpdated.fire(service.routes, currentGroup, currentRoute);
			};

			service.getRoutes = function getRoutes() {
				return service.routes;
			};

			service.updateRouteInfo = function updateRouteInfo(route) {
				var defaultRoute = _.find(route.group.menus, {default: true}) || {};
				if (route.group === route.menu) {
					service.setRoutes(route.menu, route.group, [{
						name: route.group.name,
						href: route.group.href || defaultRoute.href,
						menu: route.menu,
						group: route.group
					}]);
				} else {
					service.setRoutes(route.menu, route.group, [{
						name: route.group.name,
						href: route.group.href || defaultRoute.href,
						menu: defaultRoute,
						group: route.group
					}, {
						name: route.route || route.menu.name,
						href: route.menu.href,
						route: route.route,
						menu: route.menu,
						group: route.group
					}]);
				}
			};

			service.updateRouteStatus = function updateRouteStatus() {
				if (!$state.current.key || !menus) {
					return;
				}
				var moduleId = $state.params.moduleId;
				var keys = $state.current.key.split(/\|/g);
				var group;
				if (moduleId) {
					group = _.find(menus.groups, {key: keys.splice(0, 1)[0], moduleId: moduleId});
				} else {
					group = _.find(menus.groups, {key: keys.splice(0, 1)[0]});
				}


				if (!group) {
					return;
				}
				var menu = _.find(group.menus, {key: keys.splice(0, 1)[0]});
				if (!menu) {
					currentRoute = {group: group, menu: group};
				}
				if (menu && menu.routes && keys.length) {
					var subRoute = menu.routes[keys.splice(0, 1)[0]];
					currentRoute = {group: group, menu: menu, route: subRoute};
				} else {
					currentRoute = {group: group, menu: menu};
				}
				service.updateRouteInfo(currentRoute);
				if (currentMenu !== menu && currentMenu) {
					currentMenu.selected = false;
				}

				currentMenu = menu;
				currnetGroup = group;
				group.expanded = true;
				menu.selected = true;
			};

			service.navigateTo = function navigateTo(route) {
				if(!route){
					return;
				}
				if (currentMenu !== route.menu && currentMenu) {
					currentMenu.selected = false;
				}
				currnetGroup = route.group;
				currentMenu = route.menu;

				if (route.menu.href && route.menu.href !== '#') {
					if (globals.spaMode) {
						window.location = globals.basAppRoot + route.menu.href;
					} else {
						window.location.href = globals.basAppRoot + route.menu.href;
					}
					if (!$state.current.abstract) {
						$state.reload();
					}
					service.updateRouteInfo(route);
					route.menu.selected = true;
				}
			};


			var getSystemMenus = function getSystemMenus() {
				return $http.get(globals.basAppRoute + 'components/content/json/menu-options.json');
			};

			var getDyncMenus = function getDyncMenus() {
				return $http.get(globals.basAppRoot + '/module/extend/list/tree');
			};

			var createDyncMenu = function createDyncMenu(dyncGroup, schema) {
				dyncGroup.menus = dyncGroup.menus || [];
				dyncGroup.icon = schema.icon;
				dyncGroup.key = schema.key;
				angular.forEach(schema.menus, function (scItem) {
					var item = angular.copy(scItem);
					item.isDynamic = true;
					item.name = item.name.replace(/%moduleId%/g, dyncGroup.moduleId).replace(/%name%/g, dyncGroup.name);
					item.href = encodeURI(item.href.replace(/%moduleId%/g, dyncGroup.moduleId).replace(/%name%/g, dyncGroup.name));
					dyncGroup.menus.push(item);
				});
				return dyncGroup;
			};

			var setSelected = function setSelected(systemMenus) {
				var location = window.location.pathname.replace(/^\/pccms\//, '') + window.location.hash;
				angular.forEach(systemMenus.groups, function (group) {
					if (group.href && group.href === location) {
						group.selected = true;
					}
					angular.forEach(group.menus, function (menu) {
						if (menu.href && (menu.href === location || menu.href === ('/' + location))) {
							menu.selected = true;
							group.expanded = true;
						}
					});
				});
			};

			service.reloadMenus = function reloadMenus() {
				$localStorage.menu = $localStorage.menu || {};
				if ($localStorage.menu.config) {
					var systemMenus = $localStorage.menu.config;
					menus = systemMenus;
					menuUpdated.fire(systemMenus, true);
				}

				$q.all([getSystemMenus(), getDyncMenus()]).then(function (responses) {
					var systemMenus = responses[0].data;
					var dynamicMenus = responses[1].data.data;

					var schema = _.find(systemMenus.groups, {'dymenus': 'true'});
					var index = _.indexOf(systemMenus.groups, schema);
					if (index >= 0) {
						_.forEach(dynamicMenus, function (menu) {
							var dyncMenu = createDyncMenu(menu, schema);
							systemMenus.groups.splice(index++, 0, dyncMenu);
						});
					}
					_.remove(systemMenus.groups, {'dymenus': 'true'});
					menus = systemMenus;
					service.inited = false;
					setSelected(systemMenus);
					menuUpdated.fire(systemMenus, true);
				});
			};

			service.registerRouteUpdated = function registerRouteUpdated(hander) {
				routeUpdated.register(hander);
			};

			service.unregisterRouteUpdated = function unregisterRouteUpdated(hander) {
				routeUpdated.unregister(hander);
			};

			service.registerMenuUpdated = function registerMenuUpdated(handler) {
				menuUpdated.register(handler);
			};

			service.unregisterMenuUpdated = function unregisterMenuUpdated(handler) {
				menuUpdated.unregister(handler);
			};

			service.reloadMenus();
			return service;
		}]);

}(angular));
/*global angular*/
(function (angular) {
	"use strict";
	var module = angular.module('platform');
	module.factory('platformTemplatePreviewSvc', ['desktopMainSvc', function () {
		var service = {};

		service.devices = {
			pc: 4,
			phone: 5,
			reposive: 9,
		};

		service.preview = function preview(pageid, state, isPubTpl, device) {
			if (!device) {
				window.open(globals.basAppRoot + 'js/template/index.html#/template-setting?' +
					'state=' + state + '&isPubTpl=' + isPubTpl + '&pageid=' + pageid);
			} else {
				window.open(globals.basAppRoot + 'js/template/index.html#/template-setting?' +
					'state=' + state + '&isPubTpl=' + isPubTpl + '&pageid=' + pageid + '&device=' + device);
			}
		};

		service.previewDetail = function previewDetail(template, pageid){
			window.open(globals.basAppRoot + 'js/template/index.html#/template-setting?' +
				 '&pageid=' + pageid + '&template=' + template+'&state=preview');
		}
		return service;
	}]);
}(angular));
/*global angular*/
(function (angular) {
	"use strict";
	angular.module('platform').controller('platformModalMessageCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

	}]);
}(angular));
/*global angular*/
(function (angular) {
	"use strict";
	angular.module('platform').controller('platformModalTipCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
		//close the dialog on three seconds later after display.
		$timeout(function () {
			$scope.closeModal(true);
		}, 3000);

		$scope.getTipIcon = function getTipIcon() {
			switch ($scope.modalOptions.type) {
				case 'success':
					return 'icon-success';
				case 'warming':
					return 'icon-warming';
				default:
					return 'icon-loading';
			}
		};

		$('html').css('overflow-y', 'auto');

		$('.tip-box').closest('.modal-content')
			.css('border', 0)
			.css('box-shadow', '0 0 0')
			.css('background-color', '#C4C5CA')
			.closest('.modal-dialog')
			.css('box-shadow', '0 0 0')
			.css('opacity', 0.6);

		$('.tip-box').closest('.modal-backdrop').css('display', 'none');

		$('.tip-box').closest('.nsw.modal-dialog').css('margin',0);

		$('.tip-box').closest('.nsw.modal').css('width', $('.modal-content').width)
			.css('height', '59px')
			.css('overflow', 'hidden')
			.css('margin-top','150px')
			.css('width','300px')
			.css('margin-left','40%');
	}]);
}(angular));
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
(function (angular) {
	"use strict";
	angular.module('platform').controller('aceEditorFullScreenCtrl', ['$scope', function ($scope) {
		$scope.width = $(window).width();
		$scope.height = $(window).height();
	}]);
}(angular));
/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('platformFormBuilderSvc', ['$templateCache', '$compile', 'rowBuilderSvc', 'platformFormDomainSvc',
		function ($templateCache, $compile, rowBuilderSvc, platformFormDomainSvc) {
			var service = {};
			var getTemplate = function getTemplate(domain) {
				var name = 'form-' + domain + '.html';
				return $templateCache.get(name) || '';
			};

			var getRowTemplate = function getRowTemplate(formName, config) {
				var domain = platformFormDomainSvc.getDomainConfig(config.domain) || {};
				config = angular.extend(domain, config);

				var hasLabel = _.isBoolean(config.hasLabel) ? config.hasLabel : true;
				config.label = config.label || '';

				var rowTemplate = getTemplate('row');
				var requiredTemplate = getTemplate('required');
				var labelTemplate = hasLabel ? getTemplate('label') : '';
				var inputTemplate = getTemplate(config.template);
				var errorContainerTemplate = getTemplate('errorContainer');

				var name = (config.model || '').replace(/\./g, '');
				var validatorMessages = [], validatorTips = [], message, validateTip, inputValidators = '';
				if (config.required) {
					inputValidators += 'required ';
					message = getTemplate('error');
					message = message.replace(/%errorMessage%/g, '请填写' + config.label)
						.replace(/%formName%/g, formName)
						.replace(/%name%/g, name)
						.replace(/%error%/g, 'required');
					validatorMessages.push(message);
				}

				if (config.maxLength) {
					inputValidators += 'ng-maxlength="' + config.maxLength + '" ';
					inputTemplate = inputTemplate.replace(/%maxLengthCount%/g, config.maxLength);
					message = getTemplate('error');
					message = message.replace(/%errorMessage%/g, config.label + '长度为0~' + config.maxLength + '字符')
						.replace(/%formName%/g, formName)
						.replace(/%name%/g, name)
						.replace(/%error%/g, 'maxlength');
					validatorMessages.push(message);

					validateTip = getTemplate('maxLengthValidateTip');
					validateTip = validateTip.replace(/%maxLength%/g, config.maxLength);
					validatorTips.push(validateTip);
				}

				if (config.maxWord) {
					inputValidators += 'data-max-word="' + config.maxWord + '" ';
					message = getTemplate('error');
					message = message.replace(/%errorMessage%/g, config.label + '使用逗号、空格和分隔符，并不能超过' + config.maxWord + '个关键字')
						.replace(/%formName%/g, formName)
						.replace(/%name%/g, name)
						.replace(/%error%/g, 'maxword');
					validatorMessages.push(message);
				}

				labelTemplate = labelTemplate.replace(/%required%/g, config.required ? requiredTemplate : '')
					.replace(/%label%/g, config.label);

				rowTemplate = rowTemplate.replace(/%label%/g, labelTemplate);

				var size = config.size || 5;
				var gridSize = 'col-md-%s% col-lg-%s% col-sm-%s% col-xs-%s%';

				errorContainerTemplate = validatorMessages.length ? errorContainerTemplate.replace(/%content%/g, validatorMessages.join('\r\n')) : '';
				errorContainerTemplate = errorContainerTemplate.
					replace(/%formName%/g, formName)
					.replace(/%name%/g, name);

				inputTemplate = inputTemplate.replace(/%size%/, gridSize.replace(/%s%/g, size));
				inputTemplate = inputTemplate.replace(/%type%/g, config.type || 'text');
				inputTemplate = inputTemplate.replace(/%model%/g, 'data.' + config.model || '');
				inputTemplate = inputTemplate.replace(/%name%/g, name || '');
				inputTemplate = inputTemplate.replace(/%validators%/g, inputValidators);
				inputTemplate = inputTemplate.replace(/%errors%/g, errorContainerTemplate);
				inputTemplate = inputTemplate.replace(/%validateTip%/g, config.hasValidateTip && validatorTips.length ? validatorTips.join(' ') : '');
				//text area
				inputTemplate = inputTemplate.replace(/%rows%/g, config.textRows || '');
				//directive
				inputTemplate = inputTemplate.replace(/%directive%/g, config.directive || '');
				inputTemplate = inputTemplate.replace(/%options%/g, config.directive ? 'options' : '');

				//form row
				rowTemplate = rowTemplate.replace(/%content%/g, inputTemplate);
				return rowTemplate;
			};

			service.buildFormTemplate = function buildFormTemplate(configuration) {
				if (!configuration) {
					return '';
				}
				configuration.hasLabel = _.isBoolean(configuration.hasLabel) ? configuration.hasLabel : true;
				configuration.hasValidateTip = _.isBoolean(configuration.hasValidateTip) ? configuration.hasValidateTip : true;
				var form = configuration.name, inputTemplates = [];
				_.forEach(configuration.rows, function (config) {
					config.hasLabel = _.isBoolean(config.hasLabel) ? config.hasLabel : configuration.hasLabel;
					config.hasValidateTip = _.isBoolean(config.hasValidateTip) ? config.hasValidateTip : configuration.hasValidateTip;
					inputTemplates.push(getRowTemplate(form, config));
				});
				return inputTemplates.join('\r\n');
			};

			service.buildTemplate = function buildTemplate(formOptions, editorOptions) {
				rowBuilderSvc.init(formOptions, editorOptions);
				return rowBuilderSvc.build();
			};

			service.buildForm = function buildForm(formOptions) {
				if (!formOptions) {
					return '';
				}
				formOptions.hasLabel = _.isBoolean(formOptions.hasLabel) ? formOptions.hasLabel : true;
				formOptions.hasValidateTip = _.isBoolean(formOptions.hasValidateTip) ? formOptions.hasValidateTip : true;

				var inputTemplates = [];
				_.forEach(formOptions.rows, function (row) {
					var domain = platformFormDomainSvc.getDomainConfig(row.domain) || {};
					row = angular.extend(domain, row);
					row.label = row.label || '';
					row.name = row.name || (row.model || '').replace(/\./g, '');
					row.hasLabel = _.isBoolean(row.hasLabel) ? row.hasLabel : formOptions.hasLabel;
					row.hasValidateTip = _.isBoolean(row.hasValidateTip) ? row.hasValidateTip : formOptions.hasValidateTip;
					if (row.maxLength) {
						row.validateTip = row.validateTip || 'maxLength';
					}
					inputTemplates.push(service.buildTemplate(formOptions, row));
				});
				return inputTemplates.join('\r\n');
			};


			return service;
		}]);
}(angular));
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
/*global _*/
(function (angular) {
	"use strict";

	angular.module('platform').directive('platformMenuGroup', ['platformNavigationSvc', 'desktopMainSvc',
		function (navigationService, desktopMainSvc) {
			return {
				restrict: 'A',
				require: 'ngModel',
				template: '<div>' +
				'               <div class="c-menu c-mkname" data-ng-class="getItemSelectedClass(group)" data-ng-click="selectGroup(group)"><span data-ng-class="selectMenuIcon()"></span><div data-ng-bind="group.name"/></div>' +
				'               <div class="c-menu-list">' +
				'                   <div data-ng-repeat="menu in group.menus" data-ng-class="getItemSelectedClass(menu)" class="c-menu-item" data-ng-click="selectMenu(menu)" data-ng-bind="menu.name"></div>' +
				'               </div>' +
				'           </div>',
				link: function (scope, element, attrs, ctr) {
					ctr.$render = function render() {
						scope.group = ctr.$viewValue;
						angular.forEach(scope.group.menus, function (menu) {
							if (menu.selected) {
								setSelected(menu);
								navigationService.updateRouteInfo( {group: scope.group, menu: menu});
							}
						});

						if(scope.group.href){
							if (scope.group.selected) {
								setSelected(scope.group);
								navigationService.updateRouteInfo( {group: scope.group, menu: scope.group});
							}
						}
					};

					scope.navigate = function navigate(menu) {
						navigationService.navigateTo( {group: scope.group, menu: menu});
					};

					scope.selectMenuIcon = function selectMenuIcon(){
						return scope.group.icon || 'glyphicon glyphicon-tag';
					};

					var expandWatch = scope.$watch('group.expanded', function (val) {
						var $group = element.find('.c-menu');
						if (val) {
							if (navigationService.inited) {

								$group.next().stop(true).slideDown(500, function () {
									$group.addClass('expend');
								});
							} else {
								$group.addClass('expend');
								navigationService.inited = true;
							}
						} else {
							$group.next().slideUp(500, function () {
								$group.removeClass('expend');
							});
						}
					});

					scope.selectGroup = function selectGroup(group) {
						group.expanded = !group.expanded;

						var groups = scope.$parent.navOptions.groups;
						angular.forEach(groups, function (indexGroup) {
							if (indexGroup !== group && indexGroup.expanded) {
								indexGroup.expanded = false;
							}
						});

						if (group.href) {
							setSelected(group);
							scope.navigate(group);
						}
					};

					scope.selectMenu = function selectMenu(menu) {
						setSelected(menu);
						if (menu.href) {
							scope.navigate(menu);
						}
					};

					var setSelected = function setSelected(menu) {
						if (!menu) {
							return;
						}
						scope.selectedMenu = menu;
						scope.selectedMenu.selected = true;
						scope.group.expanded = true;

						if (scope.$parent.selectedMenu && scope.$parent.selectedMenu !== menu) {
							scope.$parent.selectedMenu.selected = false;
						}
						scope.$parent.selectedMenu = menu;

					};

					scope.getItemSelectedClass = function getItemSelectedClass(item) {
						if (item.selected) {
							return 'selected';
						}
					};

					scope.$on('$destroy', function () {
						expandWatch();
					});
				}
			};
		}
	]);
}(angular));
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
(function (angular) {
	"use strict";

	angular.module('platform').directive('nswEnter', ['$parse', '$rootScope', function ($parse, $rootScope) {
		return {
			restrict: 'A',
			compile: function ($element, attr) {
				var fn = $parse(attr.nswEnter, true);

				return function ngEventHandler(scope, element) {
					element.keydown(function (event) {
						if (event.keyCode !== 13) {
							return;
						}
						var callback = function () {
							fn(scope, {$event: event});
						};
						if ($rootScope.$$phase) {
							scope.$evalAsync(callback);
						} else {
							scope.$apply(callback);
						}
					});
				};
			}
		};
	}]);
}(angular));
/*global angular*/
/**
 * author: liang can lun
 * date: 2015-12-7
 * description: for generating a bread navigation bar
 * usage: <div platfomr-bread-nav options="options"/>
 *
 * options:{
 *  items:[
 *      {href:'../index.html',name:'首页'}
 *      {href:'index.html',name:'产品管理'}
 *      {href:'.',name:'产品列表'}
 *  ]
 * }
 *
 */
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.directive('platformBreadNav', ['$state', 'platformNavigationSvc', function ($state, platformNavigationSvc) {

		return {
			restrict: 'A',
			scope: {
				breadNavs: '=platformBreadNav'
			},
			templateUrl: globals.basAppRoute + 'components/templates/platform-bread-nav-dir.html',
			link: function (scope) {
				//scope.breadNavs = scope.breadNavs);
				scope.breadNavs = scope.breadNavs || [];
				var index = scope.breadNavs.length - 1;
				if(scope.breadNavs[index]) {
					scope.breadNavs[index].href = '#';
				}

				scope.navigateTo = function navigateTo(nav) {
					platformNavigationSvc.navigateTo({group: nav.group, menu: nav.menu, route: nav.route});
				};
			}
		};

	}]);
}(angular));
/*global angular, _*/
/**
 *
 options setting:
 1. caption: string,           editor caption
 2. enableCreate: boolean,      是否可以新增
 3. enableSpeedEdit: boolean,   是否可以快速编辑
 4. enableLineEdit: boolean,    是否可以行内编辑
 5. enableSort:boolean ,        是否可以排序
 6. enableDelete: boolean,      是否可以删除
 7. onDeleted: function,         删除执行事件
 8. onCreated: function,         创建执行事件
 9. onSorted: function,          排序执行事件
 10.onLineEdited: function,      行内编辑结束事件
 11.onSelectedChanged: function, 选中项更新事件
 12.onSpeedEdit: function,       快速编辑事件
 14.data: object{dataList, selectedItem,sortBy,displayField},       数据选项
 15.formOptions: object{formName,rows, data,lookups}        增加表单设置
 */
(function (angular) {
	"use strict";
	var module = angular.module("platform");
	module.directive("platformCatalogList", ['platformModalSvc', function (platformModalSvc) {
		return {
			restrict: 'A',
			scope: {
				options: '='
			},
			templateUrl: globals.basAppRoute + 'components/templates/platform-catalog-list-dir.html',
			link: function (scope) {

				scope.options.enableCreate = _.isBoolean(scope.options.enableCreate) ? scope.options.enableCreate : !!scope.options.onCreated;
				scope.options.enableSpeedEdit = _.isBoolean(scope.options.enableSpeedEdit) ? scope.options.enableSpeedEdit : !!scope.options.onSpeedEdit;
				scope.options.enableLineEdit = _.isBoolean(scope.options.enableLineEdit) ? scope.options.enableLineEdit : !!scope.options.onLineEdited;
				scope.options.enableSort = _.isBoolean(scope.options.enableSort) ? scope.options.enableSort : !!scope.options.onSorted;
				scope.options.enableDelete = _.isBoolean(scope.options.enableDelete) ? scope.options.enableDelete : !!scope.options.onDeleted;

				scope.displayList = [];
				scope.options.setData = function setData(data) {
					if (data && data.length) {
						scope.displayList = _.sortBy(data, scope.options.data.sortBy);
						if (scope.options.data.selectedItem && scope.options.data.selectedItem.id) {
							scope.updateSelection(_.find(scope.displayList, {id: scope.options.data.selectedItem.id}));
						} else if (scope.options.data.selectedItem && scope.options.data.selectedItem._id) {
							scope.updateSelection(_.find(scope.displayList, {_id: scope.options.data.selectedItem._id}));
						} else {
							scope.updateSelection(scope.displayList[0]);
						}
					}
				};

				scope.updateSelection = function updateSelection(item) {
					if (scope.lineEditing && item !== scope.options.data.selectedItem) {
						platformModalSvc.showWarmingTip('请先保存修改！');
						return;
					}
					scope.options.data.selectedItem = item;
					scope.options.onSelectedChanged.apply(this, arguments);
				};
				scope.toggleLineEdit = function toggleLineEdit(item) {
					if(scope.options.enableSpeedEdit){
						scope.options.onSpeedEdit.call(this ,item);
						return;
					}

					if (item !== scope.options.data.selectedItem) {
						return;
					}
					scope.lineEditing = !scope.lineEditing;
					if (scope.lineEditing) {
						scope.options.data.selectedItem = item;
					} else {
						scope.options.onLineEdited.call(this, item);
					}
				};


				scope.doSaveCreate = function doSaveCreate(item) {
					if ( !scope.options.formOptions.$invalid) {
						scope.options.onCreated(item);
						scope.options.formOptions.setData({});
					}
				};

				scope.options.setData(scope.options.data.dataList);

				var watcher = scope.$watch('options.data.dataList', function (val) {
					scope.options.setData(val);
				})

				if (scope.options.formOptions) {
					scope.options.formOptions.data = scope.options.formOptions.data || {};
				}

				scope.$on('$destroy', function () {
					watcher();
				});
			}
		};
	}]);
}(angular));
/*global angular
 * usage:
 *   1. create the form througth a html template
 *   <div platform-dynamic-form template="template"/>
 *
 *   2. create the form througth a templateUrl
 *   <div platform-dynamic-form templateUrl="templateUrl"/>
 * */
(function (angular) {
	"use strict";
	angular.module('platform').directive('platformDynamicForm', ['$http', '$compile', function ($http, $compile) {
		return {
			restrict: 'A',
			replace: true,
			link: function (scope, element, attrs) {
				if (angular.isDefined(attrs.template)) {
					var template = scope.$eval(attrs.template);
					if(template){
						updateDisplay(template);
					}else{
						scope.$watch(attrs.template,function(template){
							updateDisplay(template);
						});
					}
				} else if (angular.isDefined(attrs.templateUrl)) {
					var templateUrl = scope.$eval(attrs.template);
					$http.get(templateUrl).then(function (res) {
						updateDisplay(res.data);
					});
				}

				function updateDisplay(tempate) {
					var $template = $compile(tempate)(scope);
					element.append($template);
				}
			}
		};
	}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').directive('platformImageUpload',[function(){
		return {
			template:'     <div class="image-upload" img-lib="" ng-model="img.product" data-img-count="8">' +
			'                   <i class="icon"></i>' +
			'                   <h6 class="content">点击上传</h6>' +
			'               </div>' ,
			restrict:'A',

		};
	}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').directive('platformInput', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			template: '<input type="{{type}}" class="form-control nsw-form-input col-lg-8" data-ng-change="changed()" ng-model="model" autocomplete="off" ><span data-ng-hide="hideCounter" data-ng-bind="countTip"></span>',
			link: function (scope, element, attr, ctr) {
				scope.type = attr.type;
				scope.hideCounter = !attr.ngMaxlength;
				ctr.$render = function render() {
					scope.model = ctr.$viewValue;
					updateTip();
				};

				scope.changed = function changed() {
					ctr.$setViewValue(scope.model);
					updateTip();
				};

				var updateTip = function updateTip(){
					var length = scope.model ? scope.model.length : 0;
					scope.countTip = length + '/' + attr.ngMaxlength+'字符';
				};
			}
		};
	}]);
}(angular));
/*global angular*/
/**
 * author: liang can lun
 * date: 2015-12-7
 */
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.directive('platformModalTransclude', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.basAppRoute + 'components/templates/platform-modal-dir.html'
			};
		}]);
}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').directive('nswImg', [function () {
		return {
			restrict: 'A',
			scope:true,
			template: '<div class="nsw-img-dir">' +
						'           <i class="fa fa-times nsw-img-icon remove" ng-show="enableRemove" ng-click="_removeImg();"></i>' +
						'           <i class="fa fa-eye nsw-img-icon preview" ng-show="enablePreview" ng-click="_imgPreview(url,$event)"></i>	' +
						'           <a href="javascript:void(0);">' +
						'                   <img nsw-src="{{src}}" data-ng-click="_selectImage()" class="img"></a>' +
						'           <input type="text" placeholder="请写图片描述" class="form-control alt" autocomplete="off"  data-ng-readonly="enableEditAlt" ng-model="alt" data-ng-change="_altChanged(alt)" /></li>' +
						'</div>',
			link: function (scope, element, attrs) {
				scope.enableRemove = !!attrs.nswImgRemove;
				scope.enablePreview = attrs.enablePreview==='true';
				scope.enableAlt = !!attrs.nswImgAlt;
				scope.enableEditAlt = scope.enableAlt && attrs.enableEditAlt === 'true';

				scope.alt = scope.$eval(attrs.nswImgAlt);
				scope.src = scope.$eval(attrs.nswImgSrc);

				attrs.$observe('nswImgAlt',function(val){
					scope.alt = scope.$eval(attrs.nswImgAlt);
				});
				scope._altChanged = function altChanged(val){
					_.set(scope, attrs.nswImgAlt, val);
				};

				attrs.$observe('nswImgSrc',function(val){
					scope.src = scope.$eval(attrs.nswImgSrc);
				});

				scope._srcChanged = function srcChanged(val){
					_.set(scope, attrs.nswImgSrc, val);
				};

				scope._removeImg = function removeImg(){
					_.set(scope, attrs.nswImgSrc, null);
					if(attrs.nswImgRemove){
						scope.$eval(attrs.nswImgRemove);
					}
					scope.$emit('itemremove', scope.src);
				};

				scope._selectImage = function selectImage(){
					if(attrs.enableSelectImg === 'true'){

					}
				};
			}
		}
	}]);

}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').directive('nswImgGroup', ['$timeout',function ($timeout) {
		return {
			restrict:'A',
			template:'<span class = "glyphicon glyphicon-menu-left loopleft" ng-show = "imgs.length>maxItems"  ng-click = "back()"></span>' +
			'               <div class="loopbox col-sm-11 nsw-img-group">' +
			'                   <ul>' +
			'                       <li ng-repeat = "(key,img) in imgs" class="img-container">' +
			'                           <div nsw-img ng-if="showAlt" nsw-img-src="{{nswImgSrc}}" nsw-img-alt="{{nswImgAlt}}" nsw-img-remove="{{imgRemoveAttr}}"></div>' +
			'                           <div nsw-img ng-if="!showAlt" nsw-img-src="{{nswImgSrc}}" nsw-img-remove="{{imgRemoveAttr}}"></div>' +
			'                           <div data-ng-transclude></div>' +
			'                       </li>' +
			'                   </ul>' +
			'               </div>' +
			'         <span  class = "glyphicon glyphicon-menu-right loopright" ng-show = "imgs.length>maxItems"  ng-click = "mov()"></span>',
			scope:true,
			transclude:true,
			require:'ngModel',
			link:function(scope, element ,attrs, ctrl){
				scope.enableSort = attrs.enableSort === 'true';
				scope.maxItems = parseInt(attrs.maxItems||'1');
				scope.showAlt = !!scope.nswImgAlt || attrs.showAlt === 'true';
				scope.nswImgSrc = attrs.nswImgSrc||'img.url';
				scope.nswImgAlt = attrs.nswImgAlt||'img.alt';
				scope.imgRemoveAttr = attrs.nswImgRemove;

				ctrl.$render = function $render(){
					scope.imgs = ctrl.$viewValue||[];
					var dragSource = null;

					$timeout(function(){
						$('li.img-container',element).draggable({
							axis: "x",
							appendTo: "body",
							containment: "parent",
							revert: "invalid",
							helper: "clone",
							create: function( event, ui ) {
								$(this).css('list-style','none');
							},
							start:function(){
								dragSource = $(this).scope().img;
							},
							stop:function(){
								dragSource = null;
							}
						});

						$("li.img-container", element).droppable({
							accept: "li.img-container",
							drop: function( event, ui ) {
								var target = $(this).scope().img;
								if(dragSource && target && dragSource!==target){
									var srcIndex = _.findIndex(scope.imgs, dragSource);
									_.remove(scope.imgs, dragSource);
									var targetIndex = _.findIndex(scope.imgs, target);

									if(srcIndex>targetIndex) {
										var part1 = scope.imgs.slice(0, targetIndex);
										var part2 = scope.imgs.slice(targetIndex);
									}else{
										var part1 = scope.imgs.slice(0, targetIndex+1);
										var part2 = scope.imgs.slice(targetIndex+1);
									}
									part1.push(dragSource);


									var concated = part1.concat(part2);
									scope.imgs.length = 0;
									_.forEach(concated,function(img){
										scope.imgs.push(img);
									});

									/*var srcIndex =  _.findIndex(scope.imgs, dragSource);
									if (targetIndex < srcIndex) {
										for (var index = srcIndex; index > targetIndex; index--) {
											scope.imgs[index] = scope.imgs[index - 1];
										}
										scope.imgs[index] = dragSource;
									} else if (targetIndex > srcIndex) {
										for (var index = srcIndex; index < targetIndex; index++) {
											scope.imgs[index] = scope.imgs[index + 1];
										}
										scope.imgs[index] = dragSource;
									}*/
									scope.$digest();
								}

								$('.drop-active', element).removeClass('drop-active');
							},
							over:function(){
								$('.nsw-img-dir', this).addClass('drop-active');
							},
							out:function(){
								$('.nsw-img-dir',this).removeClass('drop-active');
							}
						});
						$(".loopleft").droppable({
							accept: "li.img-container",
							over:function(){
								scope.$apply(function(){
									scope.back();
								});
							}
						});
						$(".loopright").droppable({
							accept: "li.img-container",
							over:function(){
								scope.$apply(function(){
									scope.mov();
								});
							}
						});
					});
				};

				scope.$on('itemremove', function(src){
					if($(".loopbox ul", element).hasClass('mov') && scope.imgs.length%scope.maxItems===0){
						scope.back();
					}
				});

				scope.mov = function () {
					$(".loopbox ul", element).addClass("mov").removeClass("back");
				};
				scope.back = function () {
					$(".loopbox ul", element).addClass("back").removeClass("mov");
				};
			}
		}
	}]);

}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').directive('nswSrc', [function () {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var updateSrc = function updateSrc() {
					var fullUrlReg = /^(http|https|ftp)?:\/\//;  //jshint:ignore line
					var relateUrlReg = /^[..\\]{1}/;
					var base64 = /^data:image\//;
					var localhostReg = /^~\//;
					var src = attrs.nswSrc;


					if (!src && element[0] &&
						_.isString(element[0].tagName) &&
						element[0].tagName.toLowerCase() === 'img') {
						src = globals.defaultImg;
					}

					if(src && localhostReg.test(src)){
						src = src.replace(localhostReg,globals.basAppRoot);
					}else if (src && !fullUrlReg.test(src) && !relateUrlReg.test(src) && !base64.test(src)) {
						src = globals.basImagePath + src;
					}
					if (src) {
						element.attr('src', src);
					}
				};
				attrs.$observe('nswSrc', function () {
					updateSrc();
				});

				scope.$evalAsync(function () {
					updateSrc();
				});
			}
		};
	}]);
}(angular));
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.directive('platformQrCode', [function () {

		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ctrl) {
				ctrl.$render = function render() {
					if (ctrl.$viewValue) {
						var width = parseInt(attrs.width) || 150;
						var height = parseInt(attrs.height) || 150;
						element.children().remove();
						element.qrcode({text: ctrl.$viewValue, width: width, height: height});
					}
				};
			}
		};

	}]);
}(angular));
/*
 * auther:yaoyc
 * */

/*global angular*/
(function (angular) {
	"use strict";
	var platform = angular.module('platform');
	platform
		.factory('utils', ['$rootScope', '$location', '$http', '$modal', function ($rootScope, $location, $http, $modal) {
			function alertBox(title, msg, ok, size, btnLbl) {
				$modal.open({
					template: '<div class="defa-font"><div class="modal-header"><h3 class="modal-title">{{title}}</h3></div><div class="modal-body"><p ng-bind-html="msg"></p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><span class="glyphicon glyphicon-ok"></span> ' + (btnLbl ? btnLbl : '确定') + '</button></div></div>',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.title = title;
						$scope.msg = msg;
						$scope.ok = function () {
							$modalInstance.close();
						};
					}],
					backdrop: 'static',
					size: size ? size : 'sm'
				})
					.result.then(
					function () {
						if (ok !== undefined) {
							ok();
						}
					}
				);
			}

			function confirmBox(title, msg, ok, cancel, size) {
				$modal.open({
					template: '<div class="defa-font"><div class="modal-header"><h3 class="modal-title">{{title}}</h3></div><div class="modal-body"><p>{{msg}}</p></div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><span class="glyphicon glyphicon-ok"></span> 确定</button><button class="btn btn-default" ng-click="cancel()"><span class="glyphicon glyphicon-remove"></span> 取消</button></div></div>',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.title = title;
						$scope.msg = msg;
						$scope.ok = function () {
							$modalInstance.close();
						}
						$scope.cancel = function () {
							$modalInstance.dismiss();
						};
					}],
					backdrop: 'static',
					size: size ? size : 'sm'
				})
					.result.then(
					function () {
						ok();
					},
					function () {
						if (cancel !== undefined) {
							cancel();
						}
					}
				);
			}

			function openWin(title, msg, ok, cancel, size, btnLbl) {
				var html = [];
				html[html.length] = '<div class="modal-header">';
				html[html.length] = '    <h3 class="modal-title">' + title + '</h3>';
				html[html.length] = '</div>';
				html[html.length] = '<div class="modal-body">' + msg + '</div>';
				html[html.length] = '<div class="modal-footer">';
				html[html.length] = '    <button class="btn btn-primary" type="button" ng-click="ok()">' + (btnLbl ? btnLbl : '确定') + '</button>';
				html[html.length] = '    <button class="btn btn-default" type="button" ng-click="cancel()">取消</button>';
				html[html.length] = '</div>';
				$modal.open({
					template: html.join(''),
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.title = title;
						$scope.msg = msg;
						$scope.ok = function () {
							var flag = false;
							if (ok === undefined) {
								flag = true;
							} else if (typeof ok === 'function') {
								var state = ok();
								if (state || state === undefined) {
									flag = true;
								}
							}
							if (flag) {
								$modalInstance.close();
							}
						}
						$scope.cancel = function () {
							var flag = false;
							if (cancel === undefined) {
								flag = true;
							} else if (typeof cancel === 'function') {
								var state = cancel();
								if (state || state === undefined) {
									flag = true;
								}
							}
							if (flag) {
								$modalInstance.dismiss();
							}
						};
					}],
					backdrop: 'static',
					size: size ? size : ''
				});
			}

			//图片预览弹窗
			function imgPreview(image) {
				$modal.open({
					template: '<div class="c-dialog-img-preview"><i class="fa fa-times" ng-click="close();"></i><img src="' + image + '"/></div>',
					controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
						$scope.close = function () {
							$modalInstance.close();
						};
					}],
					backdrop: 'static',
					size: ''
				});
			}

			return {
				alertBox: alertBox,
				confirmBox: confirmBox,
				openWin: openWin,
				imgPreview: imgPreview,

				helpBox: function (image, size) {
					$modal.open({
						template: '<div class="defa-font"><div class="modal-body help"><img class="w-100" nsw-src="{{asset(image)}}" /></div><div class="modal-footer"><button class="btn btn-default" ng-click="close()"><span class="glyphicon glyphicon-remove"></span> 关闭</button></div></div>',
						controller: ['$scope', '$modalInstance', function ($scope, $modalInstance) {
							$scope.image = image;
							$scope.close = function () {
								$modalInstance.close();
							};
						}],
						backdrop: 'static',
						size: size ? size : 'md'
					});
				}
			};
		}])
		.directive('templateLib', ['$modal', '$parse', 'platformModalSvc', function ($modal, $parse, platformModalSvc) {
			return {
				restrict: 'A',
				link: function (scope, element, attr) {
					element.click(function () {
						platformModalSvc.showModal({
							backdrop: 'static',
							templateUrl: globals.basAppRoute + '/components/templates/platform-template-view.html',
							controller: 'templateLib',
							size: 'lg'
						})
					})
				}
			}
		}])

		.controller('templateLib', ['$scope', '$http', 'utils', function ($scope, $http, utils) {
			$http({
				method: "GET",
				url: '/pccms/editorTpl/editorTplList?pageNum=1&pageSize=1000'
			}).success(function (requset) {
				$scope.templateLib = requset.data.list;
			});
			$scope.imgPreview = function imgPreview(image, event) {
				utils.imgPreview(image);
				event.stopPropagation();
			};
			//选择图片
			$scope.selectImg = function (item) {
				$scope.selected = item;
			};

			$scope.commit = function commit() {
				$scope.closeModal(true, {template: $scope.selected, replace: $scope.checked});

			};

			$scope.checked = true;
		}]);
}(angular));
/*globals UE*/
(function (angular) {
	"use strict";

	angular.module('platform').directive('platformUeditor', [function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: {
				simple: '@',
				maxWord: '@'
			},
			template: '<div ueditor ng-model="model" config="config" ng-change="change()"></div>',
			link: function (scope, element, attr, ctrl) {
				var configComplex = {
					initialFrameWidth: '100%',
					maximumWords: 20000,
					initialFrameHeight: 450,
					themePath: globals.basAppRoot + 'plugin/ueditor/themes/',
					langPath: globals.basAppRoot + 'plugin/ueditor/lang/',
					serverUrl: '',
					UEDITOR_HOME_URL: globals.basAppRoot + 'plugin/ueditor/'
				};

				var configSimple = {
					maximumWords: 150,
					initialFrameWidth: '90%',
					initialFrameHeight: 100,
					themePath: globals.basAppRoot + 'plugin/ueditor/themes/',
					langPath: globals.basAppRoot + 'plugin/ueditor/lang/',
					serverUrl: '',
					UEDITOR_HOME_URL: globals.basAppRoot + 'plugin/ueditor/',
					toolbars: [
						[
							'fullscreen', 'source', '|', 'undo', 'redo', '|',
							'bold', 'italic', 'underline', 'fontborder', '|', 'forecolor', 'backcolor', '|',
							'fontfamily', 'fontsize', '|',
							'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
							'link'
						]
					]
				};

				setTimeout(function () {
					scope.config = Boolean(scope.simple) ? configSimple : configComplex;
					scope.config.maximumWords = Number(scope.maxWord);
				});
				scope.change = function change() {
					ctrl.$setViewValue(scope.model);
				};

				scope.$render = function $render() {
					scope.model = ctrl.$viewValue;
				};
			}
		};
	}]);
}(angular));
/**
 * Created by yaoyc on 2016/1/26.
 */

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
/**
 * reg exp validator
 * Checking reg exp of string
 * useage
 * Validate url
 * <input type="text" nsw-regexp=''/>
 */
(function (angular) {
	"use strict";

	angular.module('platform').directive("nswMaxLength",[function(){
			return{
				restrict:'A',
				require:'?ngModel',
				link:function(scope,element,attr,ctrl){
					if(!ctrl){
						return;
					}
					var validator = function (value){
						value = value ||'';
						var nswMaxLength = parseInt(attr.nswMaxLength)|| 0;
						var totalCount =0;
						for(var i=0; i<value.length; i++){
							var c = value.charCodeAt(i);
							if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
								totalCount++;
							}
							else{
								totalCount+=2;
							}
						}
						if(nswMaxLength===0||totalCount<=nswMaxLength){
							ctrl.$setValidity('nswmaxlength',true);
							return value;
						}else{
							ctrl.$setValidity('nswmaxlength',false);
							return value;
						}
					};
					ctrl.$formatters.push(validator);
					ctrl.$parsers.unshift(validator);
/*
					var getContent = function getContent(){
						if(element.text){
							console.log(element.val());
							return element.val();
						}
						return ctrl.$viewValue;
					};*/
					/*element.on('keyup',function(){
						validator(getContent());
					});*/
					attr.$observe('nswmaxlength', function () {
						validator(ctrl.$viewValue);
					});
				}
			}

	}]);
}(angular));
/**
 * reg exp validator
 * Checking reg exp of string
 * useage
 * Validate url
 * <input type="text" nsw-regexp=''/>
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
				var splitter =/[、]+|[\|\|]+|[\$]+|[\\]+|[\s]+|[,，]+|[;；]+|[|｜]+/; //line: ignore
				var replaceChar =/[、]+|[\|\|]+|[\$]+|[\\]+|[\s]+|[,，]+|[;；]+|[|｜]+/g; //line: ignore

				var validator = function (value) {
					var maxWord = parseInt(attr.maxWord) || 0;
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

				ctrl.$viewChangeListeners.push(function(){
					var value = ctrl.$viewValue;
					if(value) {
						value = value.replace(replaceChar,',');
						ctrl.$setViewValue(value);
					}
				});

				attr.$observe('maxword', function () {
					validator(ctrl.$viewValue);
				});
			}
		};
	}])
		.directive("nswMaxLength",[function(){
			return{
				restrict:'A',
				require:'?ngModel',
				link:function(scope,element,attr,ctrl){
					if(!ctrl){
						return;
					}
					var validator = function (value){
						value = value ||'';
						var nswMaxLength = parseInt(attr.nswMaxLength)|| 0;
						var totalCount =0;
						for(var i=0; i<value.length; i++){
							var c = value.charCodeAt(i);
							if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
								totalCount++;
							}
							else{
								totalCount+=2;
							}
						}
						if(nswMaxLength===0||totalCount<=nswMaxLength){
							ctrl.$setValidity('nswmaxlength',true);
							return value;
						}else{
							ctrl.$setValidity('nswmaxlength',false);
							return value;
						}
					};
					ctrl.$formatters.push(validator);
					ctrl.$parsers.unshift(validator);
/*
					var getContent = function getContent(){
						if(element.text){
							console.log(element.val());
							return element.val();
						}
						return ctrl.$viewValue;
					};*/
					/*element.on('keyup',function(){
						validator(getContent());
					});*/
					attr.$observe('nswmaxlength', function () {
						validator(ctrl.$viewValue);
					});
				}
			}

	}]);
}(angular));
/**
 * reg exp validator
 * Checking reg exp of string
 * useage
 * Validate url
 * <input type="text" nsw-regexp=''/>
 */
(function (angular) {
	"use strict";

	angular.module('platform').directive("nswMinLength",[function(){
			return{
				restrict:'A',
				require:'?ngModel',
				link:function(element,scope,attr,ctrl){
					if(!ctrl){
						return;
					}
					var truelength = 0;

					var synchronize = function synchronize(){
						if(attr.synchronize){
							element.parent().sblings('.mess-zx').html(truelength?truelength:0);
						}
					};
					ctrl.$render(function(){

					})
					var validator = function (value){
						var nswMinLength = parseInt(attr.nswMinLength)|| 0;
						var totalCount =0;
						value = value ||'';
						for(var i=0; i<value.length; i++){
							var c = value.charCodeAt(i);
							if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
								totalCount++;
							}
							else{
								totalCount+=2;
							}

						}
						truelength = totalCount;
						if(nswMinLength===0||totalCount>=nswMinLength){
							ctrl.$setValidity('nswminlength',true);
							return value
						}else{
							ctrl.$setValidity('nswminlength',false);
						}
					};
					ctrl.$formatters.push(validator);
					ctrl.$parsers.unshift(validator);

					attr.$observe('nswminlength', function () {
						validator(ctrl.$viewValue);
					});
				}
			}

		}]);
}(angular));
/**
 * reg exp validator
 * Checking reg exp of string
 * useage
 * Validate url
 * <input type="text" nsw-regexp=''/>
 */
(function (angular) {
	"use strict";

	angular.module('platform').directive('modelCompare', [function () {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element, attr, ctrl) {
				if (!ctrl) {
					return;
				}
				var validator = function (value) {
					var compareProp = attr.modelCompare;
					var compare = scope.$eval(compareProp);

					if (value === compare || !compare) {
						ctrl.$setValidity('modelcompare', true);
						return value;
					} else {
						ctrl.$setValidity('modelcompare', false);
						return value;
					}
				};

				ctrl.$formatters.push(validator);
				ctrl.$parsers.unshift(validator);

				var watcher = scope.$watch(attr.modelCompare, function () {
					validator(ctrl.$viewValue);
				});

				attr.$observe('modelCompare', function () {
					validator(ctrl.$viewValue);
				});

				scope.$on('$destroy', function () {
					watcher();
				});
			}
		};
	}]);
}(angular));
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
/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.controller('platformImageLibSelectCtrl', ['$scope', function ($scope) {
		var imageLibService = $scope.$parent.getImageLibSvc();
		$scope.filter = '';
		$scope.selectedImgList = imageLibService.getSelectedItems();

		$scope.loadFilterlist = function loadFilterlist() {
			imageLibService.loadItems($scope.pageSize, $scope.bigCurrentPage, $scope.filter);
		};

		$scope.loadFilterlist();
	}]);
}(angular));
/*global angular*/
(function (angular) {
	"use strict";

	var module = angular.module('platform');
	module.controller('platformImageLibUploadCtrl', ['$scope', 'utils', 'platformModalSvc', function ($scope, utils,platformModalSvc) {

		var imageLibService = $scope.$parent.getImageLibSvc();
		var isOverflow = true;

		var delFileExtension = function delFileExtension(str) {
			var reg = /\.\w+$/;
			return str.replace(reg, '');
		};

		var onBeforeFileQueued = function onBeforeFileQueued(sender) {
			//验证可上传图片的张数
			var len = sender.getFiles('queued').length;//查询上传队列中的文件数
			if (len >= imageLibService.maxCount && isOverflow) {
				isOverflow = false;
				platformModalSvc.showWarmingMessage('只能上传' + imageLibService.maxCount + ' 张图片！！！','提示');
				return false;
			}
		};

		var onFileQueued = function onFileQueued(sender, file) {
			sender.makeThumb(file, function (error, src) {
				if (error) {
					//不支持预览
					return;
				}
				//加入上传队列
				var id = file.id, img = {};
				img.src = src;
				img.name = delFileExtension(file.name);
				img.state = '准备上传';
				img.hasProgress = false;
				img.progress = 0;
				$scope.fileQueued[id] = img;
				imageLibService.addCreatedItems(img);
				//触发页面刷新
				$scope.$apply();
			}, 94, 79);
		};

		var onUploadStarted = function onUploadStarted(sender, file) {
			var id = file.id;
			sender.option('formData', {'zdyName': $scope.fileQueued[id].name});
		};

		var onUploadProgress = function onUploadProgress(sender, file, percentage) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = true;
			$scope.fileQueued[id].progress = percentage;
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadError = function onUploadError(sender, file) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = false;
			$scope.fileQueued[id].state = '上传失败';
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadSuccess = function onUploadSuccess(sender, file, res) {
			var id = file.id;
			$scope.fileQueued[id].hasProgress = false;
			$scope.fileQueued[id].progress = 100;
			$scope.fileQueued[id].state = '上传成功';
			$scope.fileSuccessQueued.push(res.data);
			//触发页面刷新
			$scope.$digest();
		};

		var onUploadFinished = function onUploadFinished() {
			$scope.$emit('close', $scope.fileSuccessQueued);
		};

		var onError = function onError(sender, res) {
			if (res === 'Q_TYPE_DENIED') {
				platformModalSvc.showWarmingMessage('图片类型不正确！！！','提示');
			} else if (res === 'Q_EXCEED_SIZE_LIMIT') {
				platformModalSvc.showWarmingMessage('图片总大小超出！！！','提示');
			} else if (res === 'Q_EXCEED_NUM_LIMIT') {
				platformModalSvc.showWarmingMessage('图片数量超出！！！','提示');
			}
		};

		$scope.uploaderOptions = {
			multiple: imageLibService.multiple,
			beforeFileQueued: onBeforeFileQueued,
			fileQueued: onFileQueued,
			uploadStart: onUploadStarted,
			uploadProgress: onUploadProgress,
			uploadError: onUploadError,
			uploadSuccess: onUploadSuccess,
			uploadFinished: onUploadFinished,
			error: onError
		};
	}]);
}(angular));
/*global angular, _*/
(function (angular) {
	"use strict";
	angular.module('platform').directive('platformImageSlider', ['$timeout',
		function ($timeout) {
			return {
				restrict: 'A',
				scope: {
					visualSize: '@',
					maxSize: '@',
					rows: '@',
					enableView: '@',
					enableSelect: '@',
					enableDelete: '@',
					onDeleted: '&',
					onChecked: '&'
				},
				templateUrl: globals.basAppRoute + 'components/templates/platform-image-slider-dir.html',
				require: 'ngModel',
				link: function (scope, element, attrs, ngModel) {
					var checkedItems = [];
					scope.imageList = [];

					scope.visualSize = scope.visualSize || 1;
					scope.maxSize = scope.maxSize || 1;
					scope.rows = scope.rows || 1;
					scope.enableView = scope.enableView || true;
					scope.enableSelect = scope.enableSelect || 1;
					scope.enableDelete = scope.enableDelete || 1;

					scope.onDeleted = scope.onDeleted || angular.noop;
					scope.onSelect = scope.onSelect || angular.noop;

					var sliderOptions = {
						titCell: '.hd ul',
						mainCell: '.bd ul',
						vis: parseInt(scope.maxSize),
						autoPlay: true,
						autoPage: true,
						effect: "left",
						trigger: "click"
					};

					ngModel.$render = function $render() {
						scope.imageList = ngModel.$viewValue;
						$timeout(function () {
							//call slider jquery plugin
							$('.picScroll-left', element).slide(sliderOptions);
						});
					};
					scope.deleteItem = function deleteItem(item) {
						if (!scope.enableDelete) {
							return;
						}
						_.remove(scope.imageList, {_id: item._id});
						scope.onDeleted.apply(this, arguments);
					};

					scope.checkImage = function checkImage(image) {
						if (!scope.enableSelect) {
							return;
						}
						var isChecked = _.find(checkedItems, {_id: image._id});
						if (isChecked) {
							_.remove(checkedItems, {_id: image._id});
						} else {
							if (checkedItems.length === scope.maxSize) {

							} else {
								checkedItems.push(image);
							}
						}
						isChecked = !isChecked;
						scope.onChecked.call(this, image, isChecked);
					};

					scope.checkImageChecked = function checkImageChecked(image) {
						return _.find(checkedItems, {_id: image._id});
					};


				}
			};
		}
	]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').factory('adlibBuilderSvc',
		['baseTemplateBuilder','validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {

				var service = {}, baseBuilder = new baseTemplateBuilder();

				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('adlib');

					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives||'');
				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').service('baseTemplateBuilder', ['$templateCache',
		function ($templateCache) {
			return function Constructor() {
				var service = {};
				service.nameFormat = 'form-%name%.html';

				service.init = function init(formOptions, editorOptions) {
					service.form = formOptions;
					service.editor = editorOptions;
					//service.template = '';
					resetConfiguration();
				};

				service.getTemplate = function getTemplate(name, readonly) {
					name = service.nameFormat.replace(/%name%/g, name);
					var template = $templateCache.get(name);
					service.template = readonly ? service.template : template;
					return template;
				};

				service.buildTemplateKey = function buildTemplateKey(reg, value) {
					service.template = service.template.replace(reg, value);
				};

				service.buildConfigurations = function buildConfigurations() {
					angular.forEach(service.configuration, function (config) {
						service.buildTemplateKey(config.key, config.value);
					});
					return service.template;
				};

				service.addConfiguration = function addConfiguration(configurations) {
					if (_.isUndefined(configurations)) {
						return;
					}

					if (!_.isArray(configurations)) {
						configurations = [configurations];
					}

					if ((_.isRegExp(arguments[0]) && !_.isUndefined(arguments[0]))) {
						configurations = [{key: arguments[0], value: arguments[1]}];
					}

					_.forEach(configurations, function (config) {
						service.configuration.unshift(config);//new added items has a higher priority
					});
				};

				var gridSize = 'col-md-%s% col-lg-%s% col-sm-%s% col-xs-%s%';
				var resetConfiguration = function resetConfiguration() {
					service.configuration = [
						{key: /%formName%/g, value: (service.form.name || '')},
						{key: /%name%/g, value: (service.editor.name || '')},
						{key: /%default%/g, value: (service.editor['default'] || '')},
						{key: /%lookup%/g, value: (service.editor.lookup || '')},
						{key: /%size%/g, value: gridSize.replace(/%s%/g, service.editor.size)},
						{key: /%type%/g, value: (service.editor.type || '')},
						{key: /%model%/g, value: ('data.' + service.editor.model || '')},
						{key: /%directive%/g, value: (service.editor.directive || '')},
						{key: /%options%/g, value: (service.editor.options || '')},
						{key: /%maxLength%/g, value: (service.editor.maxLength || '')},
						{key: /%maxWord%/g, value: (service.editor.maxWord || '')},
						{key: /%label%/g, value: (service.editor.label || '')},
						{key: /%placeholder%/g, value: (service.editor.placeholder || '')},
						{key: /%validators%/g, value: (service.editor.validateDirectives || '')},
						{key: /%id%/g, value: (service.editor.id|| '')}
					];
				};
				return service;
			};
		}]);
}(angular));
/*globals _*/
(function (angular) {
	"use strict";
	angular.module('platform').factory('checkboxBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, baseBuilder = new baseTemplateBuilder();

				service.init = function init(formOptions, editorOptions){
					baseBuilder.init(formOptions, editorOptions);

					var radioTemplate = baseBuilder.getTemplate('checkbox', true);
					baseBuilder.getTemplate('radioGroup');

					var optionTemplates = [];
					_.forEach(baseBuilder.editor.options, function (option) {
						var template = radioTemplate
							.replace(/%checked%/g, !!option.checked)
							.replace(/%key%/g, option[baseBuilder.editor.key])
							.replace(/%model%/g,'data.'+option.parent+'.'+option.model)
							.replace(/%display%/g, option[baseBuilder.editor.display]);
						optionTemplates.push(template);
					});
					baseBuilder.addConfiguration(/%content%/g, optionTemplates.join('\r\n'));
				};
				service.build = function () {

					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));


(function (angular) {
	"use strict";
	angular.module('platform').service('htmleditorBuilderSvc',
		['baseTemplateBuilder', 'validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {
				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('htmleditor');
					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives || '');
					//%simple%
					baseBuilder.addConfiguration(/%simple%/g, !!editorOptions.isSimple);
				};

				service.build = function build() {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);




}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').service('inputBuilderSvc',
		['baseTemplateBuilder', 'validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {
				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('input');
					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives||'');
				};

				service.build = function build() {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);

}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').factory('labelBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, baseBuilder = new baseTemplateBuilder();

				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('label');

					if (editorOptions.hasLabel) {
						var requiredTemplate = editorOptions.required?baseBuilder.getTemplate('required', true):'';
						baseBuilder.addConfiguration(/%required%/g, requiredTemplate);
					} else {
						baseBuilder.template = '';
						baseBuilder.configuration = [];
					}
				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
/*globals _*/
(function (angular) {
	"use strict";
	angular.module('platform').factory('radioBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, baseBuilder = new baseTemplateBuilder();

				service.init = function init(formOptions, editorOptions){
					baseBuilder.init(formOptions, editorOptions);

					var radioTemplate = baseBuilder.getTemplate('radio', true);
					baseBuilder.getTemplate('radioGroup');

					var optionTemplates = [];
					_.forEach(baseBuilder.editor.options, function (option) {
						var template = radioTemplate
							.replace(/%checked%/g, !!option.checked)
							.replace(/%key%/g, option[baseBuilder.editor.key])
							.replace(/%display%/g, option[baseBuilder.editor.display]);
						optionTemplates.push(template);
					});
					baseBuilder.addConfiguration(/%content%/g, optionTemplates.join('\r\n'));

				};

				service.build = function () {

					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));


/*globals*/
(function (angular) {
	"use strict";
	angular.module('platform').factory('rowBuilderSvc',
		['baseTemplateBuilder', '$injector', 'labelBuilderSvc',
			function (baseTemplateBuilder, $injector, labelBuilderSvc) {

				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function (formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('row');

					var editorBuilderSvc = $injector.get(editorOptions.template + 'BuilderSvc');
					editorBuilderSvc.init(formOptions, editorOptions);
					labelBuilderSvc.init(formOptions, editorOptions);

					var labelTemplate = labelBuilderSvc.build();
					var editorTemplate = editorBuilderSvc.build();

					baseBuilder.addConfiguration(/%label%/g, labelTemplate);
					baseBuilder.addConfiguration(/%content%/g, editorTemplate);

				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').service('selectBuilderSvc',
		['baseTemplateBuilder', 'validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {
				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('select');

					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives||'');

					baseBuilder.addConfiguration(/%key%/g, editorOptions.key||'');
					baseBuilder.addConfiguration(/%display%/g, editorOptions.display||'');
				};

				service.build = function build() {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').factory('singleimageBuilderSvc',
		['baseTemplateBuilder','validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {

				var service = {}, baseBuilder = new baseTemplateBuilder();

				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('single-image');

					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives||'');
				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
(function (angular) {
	"use strict";
	angular.module('platform').service('textareaBuilderSvc',
		['baseTemplateBuilder', 'validationBuilderSvc', 'validationTipBuilderSvc',
			function (baseTemplateBuilder, validationBuilderSvc, validationTipBuilderSvc) {
				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					baseBuilder.getTemplate('textarea');
					validationBuilderSvc.init(formOptions, editorOptions);
					validationTipBuilderSvc.init(formOptions, editorOptions);
					baseBuilder.addConfiguration(/%errors%/g, validationBuilderSvc.build());
					baseBuilder.addConfiguration(/%validateTip%/g, validationTipBuilderSvc.build());
					baseBuilder.addConfiguration(/%validators%/g, editorOptions.validateDirectives || '');
					baseBuilder.addConfiguration(/%rows%/g, editorOptions.rows || '3');
				};

				service.build = function build() {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
/*globals _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('validationBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {

				var service = {}, baseBuilder = new baseTemplateBuilder();
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.getTemplate('errorContainer');
					baseBuilder.init(formOptions, editorOptions);
					
					var errorTemplate = baseBuilder.getTemplate('error', true);
					editorOptions.validates = editorOptions.validates || [];
					if (editorOptions.required && !_.find(editorOptions.validates,{'type':'required'})) {
						editorOptions.validates.push({type: 'required', message: '请填写%label%',directive:'data-ng-required=true'});
					}
					if (editorOptions.maxLength && !_.find(editorOptions.validates,{'type':'nswmaxlength'})) {
						editorOptions.validates.push({type: 'nswmaxlength', message: '%label%长度为0~%maxLength%字符',directive:'data-nsw-max-length="'+editorOptions.maxLength+'"'});
					}
					if (editorOptions.maxWord && !_.find(editorOptions.validates,{'type':'maxword'})) {
						editorOptions.validates.push({type: 'maxword', message: '%label%使用逗号、空格和分隔符，并不能超过%maxWord%个关键字',directive:'data-maxword="'+editorOptions.maxWord+'"'});
					}

					var errorTemplates = [];
					_.forEach(baseBuilder.editor.validates, function (validate) {
						var template = errorTemplate
							.replace(/%error%/g, validate.type)
							.replace(/%errorMessage%/g, validate.message);
						errorTemplates.push(template);
					});

					editorOptions.validateDirectives = _.map(editorOptions.validates,'directive').join(' ');

					baseBuilder.addConfiguration(/%content%/g, errorTemplates.join('\r\n'));
				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};

				return service;

			}]);
}(angular));
(function (angular) {
	"use strict";

	angular.module('platform').factory('validationTipBuilderSvc',
		['baseTemplateBuilder',
			function (baseTemplateBuilder) {
				var baseBuilder = new baseTemplateBuilder();
				var service = {};
				service.init = function init(formOptions, editorOptions) {
					baseBuilder.init(formOptions, editorOptions);
					if(editorOptions.hasValidateTip && editorOptions.validateTip){
						baseBuilder.getTemplate(editorOptions.validateTip+'-tip');
					}else{
						baseBuilder.template = '';
						baseBuilder.configuration = [];
					}
				};

				service.build = function () {
					return baseBuilder.buildConfigurations();
				};
				return service;
			}]);
}(angular));
/*globals KindEditor, _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('nswmultiimagePluginSvc', ['platformModalSvc', function (platformModalSvc) {
		var service = {};
		service.init = function init() {
			KindEditor.plugin('nswmultiimage', function (K) {
				var self = this, name = 'nswmultiimage', attrs = null;

				self.lang({
					'nswmultiimage':'批量图片上传'
				});

				var appendImage = function appendImage(image) {
					self.exec('insertimage', globals.basImagePath + image.url, image.fileName, null, null, null, image.align, null);
					var img = self.cmd.commonNode({img: "*"});
					var p = img.parent();
					while (p && p.name) {
						if (p.name === "body" || p.name === "p") {
							break;
						}
						p = p.parent();
					}
					if ((!p || p.name !== "p")) {
						img.after('<p></p>');
						p = img.next();
						p.append(img);
						if (attrs) {
							p.attr(attrs);
						}
					}
					if (p) {
						if (attrs === null) {
							attrs = p.attr();
						}
						p.after('<span></span>');
						var span = p.next();
						self.cmd.range.selectNode(span[0]);
						self.cmd.select(false);
						if (span) {
							span.remove();
						}
					}
					if (p && image.align) {
						switch (image.align) {
							case "center":
								p.css("text-align", image.align).css("text-indent", null);
								break;
						}
					}
				};

				var updateDisplay = function updateDisplay(imgList) {
					attrs = null;
					_.forEach(imgList, appendImage);
				};

				var showImageDialog = function showImageDialog() {
					return platformModalSvc.showModal({
						templateUrl: globals.basAppRoot + '/partials/imglibWin.html',
						controller: 'imglibWinCtrl',
						size: 'lg',
						options: {
							imgConfig: {
								'count': 15,
								'size': 3000,
								'width': 800,
								'height': 600,
								'ext': 'gif,jpg,jpeg,bmp,png'
							},
							backImgList:[]
						}
					}).then(function (imgList) {
						updateDisplay(imgList);
					});
				};

				self.plugin.spechars = {
					edit: function () {
						showImageDialog();
					}
				};

				self.clickToolbar(name, self.plugin.spechars.edit);
			});
		};
		return service;
	}]);
}(angular));
/*globals KindEditor*/
(function (angular, undefined) {
	"use strict";

	angular.module('platform').factory('nswPreviewPluginSvc', [function () {
		var service = {};
		service.init = function init() {
			KindEditor.plugin('nswpreview', function (K) {
				var self = this, name = 'nswpreview';

				self.lang({
					'nswpreview': 'PC预览'
				});

				self.clickToolbar(name, function () {
					var html = '<div style="padding:10px 20px;">' +
							'<iframe class="ke-textarea" frameborder="0" style="width:100%;height:550px;"></iframe>' +
							'</div>',
						dialog = self.createDialog({
							name: name,
							width: '80%',
							title: self.lang(name),
							body: html
						}),
						iframe = K('iframe', dialog.div),
						doc = K.iframeDoc(iframe);
					doc.open();
					doc.write(self.fullHtml());
					doc.close();
					K(doc.body).css('background-color', '#FFF');
					iframe[0].contentWindow.focus();
				});
			});
		};
		return service;
	}]);
}(angular, undefined));

/*globals KindEditor*/
(function (angular, undefined) {
	"use strict";

	angular.module('platform').factory('nswPreviewPhonePluginSvc', [function () {
		var service = {};
		service.init = function init() {
			KindEditor.plugin('nswpreviewphone', function (K) {
				var self = this, name = 'nswpreviewphone';

				self.lang({
					'nswpreviewphone': '手机预览'
				});

				self.clickToolbar(name, function () {
					var html = '<div style="padding:10px 20px;" class="phone-box">' +
							'<iframe class="ke-textarea" frameborder="0" style="width:320px;height:480px;"></iframe>' +
							'</div>',
						dialog = self.createDialog({
							name: name,
							width: 350,
							title: self.lang(name),
							body: html
						}),
						iframe = K('iframe', dialog.div),
						doc = K.iframeDoc(iframe);
					doc.open();
					doc.write(self.fullHtml());
					doc.close();
					K(doc.body).css('background-color', '#FFF');
					iframe[0].contentWindow.focus();
				});
			});
		};
		return service;
	}]);
}(angular, undefined));

/*globals KindEditor*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('reformatPluginSvc', [function () {
		var service = {};
		service.init = function init() {
			//格式划
			KindEditor.plugin('reformat', function (K) {
				var self = this, name = 'reformat',
					blockMap = K.toMap('blockquote,center,div,h1,h2,h3,h4,h5,h6,p');

				self.lang({
					'reformat': '自动排版'
				});

				function getFirstChild(knode) {
					var child = knode.first();
					while (child && child.first()) {
						child = child.first();
					}
					return child;
				}

				self.clickToolbar(name, function () {
					var dialog = K.dialog({
						width: 240,
						title: '温馨提示',
						body: '<div style="margin:10px;"><strong>对齐文本功能将取消之前你设置好的所有文本样式</strong></div>',
						closeBtn: {
							name: '关闭',
							click: function () {
								dialog.remove();
							}
						},
						yesBtn: {
							name: '确定',
							click: function () {
								self.focus();
								var doc = self.edit.doc,
									child = K(doc.body).first(), next,
									nodeList = [], subList = [];

								function RBR(child) {
									if ((child.name === "div" && child.hasAttr("style") && child.hasAttr("class")) || child.name === "#text" || child.name === "body") {
										var html = child.html();
										if (html === "") {
											if (child.name === "body") {
												return false;
											}
											return RBR(K(doc.body));
										}
										html = "<p style='text-indent:2em;'>" + html.replace(/(<br[^>]*\/>)/ig, "</p><p style='text-indent:2em;'>") + "</p>";
										html = html.replace(/<p style='text-indent:2em;'><\/p>/g,'');
										child.html(html);
										return true;
									}
								}

								if (child && RBR(child) !== true) {
									while (child) {
										next = child.next();
										var firstChild = getFirstChild(child);
										if (child.html() === "<br />") {
											next = child.next();
											child.remove();
										} else {
											if (!firstChild || firstChild.name !== 'img') {
												if (blockMap[child.name]) {
													child.html(child.html().replace(/^(\s|&nbsp;|　)+/ig, ''));
													//alert(child.html());
													child.css('text-indent', '2em');
												} else if(subList) {
													subList.push(child);
												}
												if (!next || (blockMap[next.name] || blockMap[child.name] && !blockMap[next.name])) {
													if (subList.length > 0) {
														nodeList.push(subList);
													}
													subList = [];
												}
											} else if (firstChild) {
												if (firstChild.name === "img") {
													var istrue = true;
													K(child).scan(function (node) {
														if (node.nodeName !== "IMG" && node.nodeName !== "#text") {
															istrue = false;
															return false;
														}
													});
													if (istrue) {
														child.css("text-indent", 0);
														child.css("text-align", "center");
													}
												}
											}
											child = next;
										}
									}
									K.each(nodeList, function (i, subList) {
										var wrapper = null;
										wrapper = K('<p style="' + (subList[0].name === 'img' ? 'text-align:center' : 'text-indent:2em') + ';"></p>', doc);
										subList[0].before(wrapper);
										K.each(subList, function (i, knode) {
											wrapper.append(knode);
										});
									});
								}
								self.addBookmark();
								dialog.remove();
							}
						},
						noBtn: {
							name: '取消',
							click: function () {
								dialog.remove();
							}
						}
					});
				});
			});
		};

		return service;
	}]);
}(angular));

/*globals KindEditor, _*/
(function (angular) {
	"use strict";

	angular.module('platform').factory('selectmodularPluginSvc', ['platformModalSvc', function (platformModalSvc) {
		var service = {};
		service.init = function init() {
			KindEditor.plugin('selectmodular', function (K) {
				var self = this, name = 'selectmodular';

				self.lang({
					'selectmodular': '文章模板'
				});

				var updateDisplay = function updateDisplay(content, replace) {
					if (replace) {
						self.html(content);
					} else {
						self.insertHtml(content);
					}
				};

				var showImageDialog = function showImageDialog() {
					return platformModalSvc.showModal({
						backdrop: 'static',
						templateUrl: globals.basAppRoute + '/components/templates/platform-template-view.html',
						controller: 'templateLib',
						size: 'lg'
					}).then(function (module) {
						if (module && module.template) {
							updateDisplay(module.template.htmlContent || '', module.replace);
						}
					});
				};

				self.plugin.spechars = {
					edit: function () {
						showImageDialog();
					}
				};

				self.clickToolbar(name, self.plugin.spechars.edit);
			});
		};
		return service;
	}]);
}(angular));
/*globals KindEditor*/
(function () {
	"use strict";
	angular.module('platform').factory('spechartsPluginSvc', [function () {
		var service = {};

		function toArray(str) {
			return str.split(",");
		}

		var charsContent = [
			{
				name: "tsfh",
				title: "特殊字符",
				content: toArray("、,。,·,ˉ,ˇ,¨,〃,々,—,～,‖,…,‘,’,“,”,〔,〕,〈,〉,《,》,「,」,『,』,〖,〗,【,】,±,×,÷,∶,∧,∨,∑,∏,∪,∩,∈,∷,√,⊥,∥,∠,⌒,⊙,∫,∮,≡,≌,≈,∽,∝,≠,≮,≯,≤,≥,∞,∵,∴,♂,♀,°,′,″,℃,＄,¤,￠,￡,‰,§,№,☆,★,○,●,◎,◇,◆,□,■,△,▲,※,→,←,↑,↓,〓,〡,〢,〣,〤,〥,〦,〧,〨,〩,㊣,㎎,㎏,㎜,㎝,㎞,㎡,㏄,㏎,㏑,㏒,㏕,︰,￢,￤,℡,ˊ,ˋ,˙,–,―,‥,‵,℅,℉,↖,↗,↘,↙,∕,∟,∣,≒,≦,≧,⊿,═,║,╒,╓,╔,╕,╖,╗,╘,╙,╚,╛,╜,╝,╞,╟,╠,╡,╢,╣,╤,╥,╦,╧,╨,╩,╪,╫,╬,╭,╮,╯,╰,╱,╲,╳")
			},
			{name: "lmsz", title: "罗马字符", content: toArray("ⅰ,ⅱ,ⅲ,ⅳ,ⅴ,ⅵ,ⅶ,ⅷ,ⅸ,ⅹ,Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ,Ⅺ,Ⅻ")},
			{
				name: "szfh",
				title: "数字字符",
				content: toArray("⒈,⒉,⒊,⒋,⒌,⒍,⒎,⒏,⒐,⒑,⒒,⒓,⒔,⒕,⒖,⒗,⒘,⒙,⒚,⒛,⑴,⑵,⑶,⑷,⑸,⑹,⑺,⑻,⑼,⑽,⑾,⑿,⒀,⒁,⒂,⒃,⒄,⒅,⒆,⒇,①,②,③,④,⑤,⑥,⑦,⑧,⑨,⑩,㈠,㈡,㈢,㈣,㈤,㈥,㈦,㈧,㈨,㈩")
			},
			{
				name: "rwfh",
				title: "日文字符",
				content: toArray("ぁ,あ,ぃ,い,ぅ,う,ぇ,え,ぉ,お,か,が,き,ぎ,く,ぐ,け,げ,こ,ご,さ,ざ,し,じ,す,ず,せ,ぜ,そ,ぞ,た,だ,ち,ぢ,っ,つ,づ,て,で,と,ど,な,に,ぬ,ね,の,は,ば,ぱ,ひ,び,ぴ,ふ,ぶ,ぷ,へ,べ,ぺ,ほ,ぼ,ぽ,ま,み,む,め,も,ゃ,や,ゅ,ゆ,ょ,よ,ら,り,る,れ,ろ,ゎ,わ,ゐ,ゑ,を,ん,ァ,ア,ィ,イ,ゥ,ウ,ェ,エ,ォ,オ,カ,ガ,キ,ギ,ク,グ,ケ,ゲ,コ,ゴ,サ,ザ,シ,ジ,ス,ズ,セ,ゼ,ソ,ゾ,タ,ダ,チ,ヂ,ッ,ツ,ヅ,テ,デ,ト,ド,ナ,ニ,ヌ,ネ,ノ,ハ,バ,パ,ヒ,ビ,ピ,フ,ブ,プ,ヘ,ベ,ペ,ホ,ボ,ポ,マ,ミ,ム,メ,モ,ャ,ヤ,ュ,ユ,ョ,ヨ,ラ,リ,ル,レ,ロ,ヮ,ワ,ヰ,ヱ,ヲ,ン,ヴ,ヵ,ヶ")
			},
			{
				name: "xlzm",
				title: "希腊字母",
				content: toArray("Α,Β,Γ,Δ,Ε,Ζ,Η,Θ,Ι,Κ,Λ,Μ,Ν,Ξ,Ο,Π,Ρ,Σ,Τ,Υ,Φ,Χ,Ψ,Ω,α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω")
			},
			{
				name: "ewzm",
				title: "俄文字符",
				content: toArray("А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я,а,б,в,г,д,е,ё,ж,з,и,й,к,л,м,н,о,п,р,с,т,у,ф,х,ц,ч,ш,щ,ъ,ы,ь,э,ю,я")
			},
			{name: "pyzm", title: "拼音字母", content: toArray("ā,á,ǎ,à,ē,é,ě,è,ī,í,ǐ,ì,ō,ó,ǒ,ò,ū,ú,ǔ,ù,ǖ,ǘ,ǚ,ǜ,ü")},
			{
				name: "yyyb",
				title: "英语字符",
				content: toArray("i:,i,e,æ,ʌ,ə:,ə,u:,u,ɔ:,ɔ,a:,ei,ai,ɔi,əu,au,iə,εə,uə,p,t,k,b,d,g,f,s,ʃ,θ,h,v,z,ʒ,ð,tʃ,tr,ts,dʒ,dr,dz,m,n,ŋ,l,r,w,j,")
			},
			{
				name: "zyzf",
				title: "其他字符",
				content: toArray("ㄅ,ㄆ,ㄇ,ㄈ,ㄉ,ㄊ,ㄋ,ㄌ,ㄍ,ㄎ,ㄏ,ㄐ,ㄑ,ㄒ,ㄓ,ㄔ,ㄕ,ㄖ,ㄗ,ㄘ,ㄙ,ㄚ,ㄛ,ㄜ,ㄝ,ㄞ,ㄟ,ㄠ,ㄡ,ㄢ,ㄣ,ㄤ,ㄥ,ㄦ,ㄧ,ㄨ,▁,▂,▃,▄,▅,▆,▇,�,█,▉,▊,▋,▌,▍,▎,▏,▓,▔,▕,▼,▽,◢,◣,◤,◥,☉,⊕,〒,〝,〞")
			}
		];
		service.init = function init() {

			KindEditor.plugin('spechars', function (K) {
				var self = this, name = 'spechars';

				self.lang({
					'spechars':'特殊字符'
				});

				self.plugin.spechars = {
					edit: function () {
						var html = '<div style="padding:10px;">';
						html += '<div class="tabs spec-char"></div>';
						for (var i = 0; i < charsContent.length; i++) {
							var obj = charsContent[i];
							html += '<div class="tabbody tab' + i + '" style="display:none;">';
							for (var j = 0; j < obj.content.length; j++) {
								html += '<span>' + obj.content[j] + '</span>';
							}
							html += '</div>';
						}
						html += '</div>';
						var dialog = self.createDialog({
								name: name,
								width: 620,
								height: 500,
								title: "特殊字符",
								body: html
							}),
							div = dialog.div;

						var tabs = K.tabs({
							src: K('.tabs', div),
							afterSelect: function (i) {
							}
						});
						tabs.div.addClass('spec-char');
						K(".ke-tabs", div).css("margin-bottom", "0");
						for (var i = 0; i < charsContent.length; i++) {
							var specChar = charsContent[i];
							tabs.add({
								title: specChar.title,
								style: "padding:0px 5px",
								panel: K('.tab' + i, div)
							});
						}
						K(".tabbody span", div).bind("click", function () {
							self.hideDialog().focus();
							self.insertHtml(K(this).text()).hideMenu().focus();
						})

						tabs.select(0);
					}
				}
				self.clickToolbar(name, self.plugin.spechars.edit);
			});
		};
		return service;
	}]);
}());


(function (angular) {
	"use strict";

	angular.module('platform').factory('desktopMainSvc', ['$http', '$q',
		function ($http, $q) {

			var service = {}, loginUser, projectType=0;
			service.inited = false;

			service.getLoginUser = function getLoginUser() {
				var defer = $q.defer();
				if (loginUser) {
					defer.resolve(loginUser);
				}
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/user/loginUser',
				}).success(function (res) {
					loginUser = res.data;
					defer.resolve(res.data);
				});
				return defer.promise;
			};

			service.getProjectType = function getProjectType(){
				var defer = $q.defer();
				if (projectType) {
					defer.resolve(projectType);
				}
				$http({
					method: 'GET',
					url: globals.basAppRoot + 'user/findProjType',
				}).success(function (res) {
					projectType = parseInt(res.data);
					defer.resolve(projectType);
				});
				return defer.promise;
			};

			service.isPcProject = function isPcProject(){
				return projectType === 4;
			};

			service.isPoneProject = function isPoneProject(){
				return projectType === 5;
			};

			service.isResponsiveProject = function isResponsiveProject(){
				return projectType === 9;
			};

			return service;

		}]);
}(angular));
/**
 *
 */
(function (angular) {
	"use strict";

	angular.module('platform').controller('desktopMainCtrl', ['$scope', '$http', '$state', 'platformModalSvc', 'desktopMainSvc', 'platformNavigationSvc',
		function ($scope, $http, $state, platformModalSvc, desktopMainSvc, platformNavigationSvc) {
			var initLogin = function initLogin() {
				desktopMainSvc.getLoginUser().then(function (data) {
					$scope.user = data;
				});
				desktopMainSvc.getProjectType().then(function (data) {
					$scope.projectType = data;
					$scope.isPcProject = desktopMainSvc.isPcProject();
					$scope.isPhoneProject = desktopMainSvc.isPoneProject();
					$scope.isResponsiveProject = desktopMainSvc.isResponsiveProject();
					$scope.isPhoneType = desktopMainSvc.isPoneProject || desktopMainSvc.isResponsiveProject;
					$scope.isPCType = desktopMainSvc.isPcProject || desktopMainSvc.isResponsiveProject;
				});
			};

			var init = function init() {
				initLogin();
				platformNavigationSvc.reloadMenus();
			};

			$scope.exit = function exit() {
				platformModalSvc.showConfirmMessage('您确认退出系统吗?', '提示', true).then(function () {
					window.location = '/pccms/j_spring_cas_security_logout';
				});
			};

			var menuUpdated = function menuUpdated(menuOptions) {
				$scope.menuOptions = menuOptions;
				if (!$scope.$$phase) {
					$scope.$digest();
				}
			};

			var routeUpdated = function routeUpdated(routes, currentGroup, currentRoute) {
				$scope.breadNavs = routes;
				$scope.currentGroup = currentGroup;
				$scope.currentRoute = currentRoute;
			};

			$scope.$on('$stateChangeSuccess', function () {
				platformNavigationSvc.updateRouteStatus();
			});

			$scope.$on('onMenuUpdated', function () {
				platformNavigationSvc.reloadMenus();
			});
			$scope.$on('$destroy', function () {
				platformNavigationSvc.unregisterMenuUpdated(menuUpdated);
				platformNavigationSvc.unregisterRouteUpdated(routeUpdated);
			});
			platformNavigationSvc.registerRouteUpdated(routeUpdated);
			platformNavigationSvc.registerMenuUpdated(menuUpdated);
			init();

		}]);
}(angular));