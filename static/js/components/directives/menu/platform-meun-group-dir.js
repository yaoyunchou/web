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