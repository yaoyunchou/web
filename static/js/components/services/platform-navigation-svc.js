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
				var home = {name: '首页', href: '/temp/index.html'};
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
				if (!$state.current.key) {
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