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