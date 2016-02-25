var productApp = angular.module('productApp', ['platform', 'ui.tree', 'common', 'ng.ueditor', 'ui.bootstrap', 'ui.bootstrap.pagination', 'ui.nested.combobox','toolApp']);

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


angular.module('productApp').directive('leftInformation',['$compile', function ($compile) {
	return {
		restrict: 'ACE',
		link: function (scope, element) {
			var showInput = function showInput(){
				element.find('button').hide();
				$compile(element.find('.left-info').show())(scope);
			};

			var inputNgModel = $(element.find('.form-control[ng-model],.form-control[data-ng-model]')[0]).data('$ngModelController');
			var orginRender = inputNgModel.$render;
			inputNgModel.$render = function render() {
				var viewValue = inputNgModel.$viewValue;
				if (viewValue) {
					showInput();
				}
				orginRender.apply(this, arguments);
				return viewValue;
			};
			element.find('button').bind('click', function () {
				showInput();
			});
		}
	};
}]);


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
