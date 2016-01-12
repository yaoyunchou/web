var productApp = angular.module('productApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox']);

productApp.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/list');
		$stateProvider.state('list', { //产品列表
			url: '/list',///list?moduleId&name&page
			templateUrl: 'list.html',
			controller: 'listCtrl',
			key: 'product|list'
		}).state('addproduct', {//产品录入
			url: '/add-product',
			templateUrl: 'edit.html',
			controller: 'editCtrl',
			key: 'product|detail|add'
		})
			.state('addproductclass', {//产品分类录入
				url: '/add-productClass',
				templateUrl: 'addClassify.html',
				controller: 'addClassifyCtrl',
				key: 'product|class-detail|add'
			})
			.state('productclass-Edit', {
				url: '/classifyEdit?id&isLink&moduleId&name&page',
				templateUrl: 'addClassify.html',
				controller: 'addClassifyCtrl',
				key: 'product|class-detail|edit'
			})
			.state('productClassList', {//产品列表
				url: '/class-list',
				templateUrl: 'classify.html',
				controller: 'classifyCtrl',
				key: 'product|class'
			})
			.state('product-edit', {
				url: '/product-edit?id&isLink&moduleId&name&page',
				templateUrl: 'edit.html',
				controller: 'editCtrl',
				key: 'product|detail|edit'
			})
			.state('add', {
				url: "/product-add",
				templateUrl: 'edit.html',
				controller: 'editCtrl',
				key: 'product|detail|add'
			});
	}
]);


angular.module('productApp').directive('leftInformation', function () {
	return {
		restrict: 'ACE',
		replace: true,
		scope: {
			findId : '=findId'
		},
		link: function (scope, element, attrs) {
			console.log(scope.findId);
			if(scope.findId){
				element.find('button').hide();
				element.find('.left-info').show();
			}else{
				element.find('button').bind('click', function () {
					$(this).hide();
					element.find('.left-info').show();
				});
			}
		}
	}
});


productApp.factory('commonTool', function () {
	return {
		getLocalTime: function () {
			var today = new Date();
			var y = today.getFullYear();
			var mh = today.getMonth() + 1;
			var d = today.getDate();
			var h = today.getHours();
			var m = today.getMinutes();
			return y + '-' + mh + '-' + d + ' ' + h + ':' + m;
		}
	}
});
