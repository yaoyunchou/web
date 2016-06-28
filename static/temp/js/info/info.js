var infoApp = angular.module('infoApp', ['ui.tree','platform','common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox','toolApp']);

//路由配置、
infoApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
		.state('list', { //文章列表。
				key: 'info|list',
				url: '/list?moduleId&name&page',
			templateUrl: 'list.html',
			controller: 'listCtrl'
		})
		.state('add', { //文章录入。
				key:'info|detail|add',
		    url: '/add?moduleId&name&page',
		    templateProvider: ['$stateParams', '$http', '$q',function ($stateParams,$http,$q) {
		    	var defer =  $q.defer();
		    	$http
		            .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
		            .then(function(response) {
		            	 defer.resolve(response.data);
		            });
		    	 return defer.promise;
		    }],
			controller: 'editCtrl'
		})
		.state('info-add', {
				key:'info|detail|add',
			url: "/info-add",
			templateUrl: 'edit.html',			  
			controller: 'editCtrl'
		})
		.state('edit', { //文章修改。
				key:'info|detail|edit',
		  url: '/edit?id&isLink&moduleId&name&page',
		  templateProvider: ['$stateParams', '$http','$q', function ($stateParams,$http,$q) {
			  var defer =  $q.defer();
			  $http
		          .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
		          .then(function(response) {
		        	  defer.resolve(response.data);
		          });
			  return defer.promise;
			  
		  }],
		  controller: 'editCtrl'
		})
		.state('info-edit', {
				key:'info|class-detail|edit',
			url: '/info-edit?id&isLink&moduleId&name&page',
			templateUrl: 'edit.html',		  
			controller: 'editCtrl'
		})
		.state('classify', { //分类列表
				key:'info|class',
			url: '/classify?moduleId&name&page',
			templateUrl: 'classify.html',
			controller: 'classifyCtrl'
		}).state('addClassify', { //分类录入
				key:'info|class-detail|add',
			 url: '/addClassify?moduleId&name&page',
			 templateProvider: ['$stateParams', '$http','$q', function ($stateParams,$http,$q) {
				 var defer =  $q.defer();
			 	 $http
			         .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
			         .then(function(response) {
			        	 defer.resolve(response.data);
			         });
			 	return defer.promise;
			 }],
			controller: 'addClassifyCtrl'
		})
		.state('info-addClassify', {
				key:'info|class-detail|add',
			 url: '/info-addClassify',
			 templateUrl: 'addClassify.html',		
			controller: 'addClassifyCtrl'
		}).state('classifyEdit', { //分类修改。
				key:'info|class-detail|edit',
		   url: '/classifyEdit?id&isLink&moduleId&name&page',
		   templateProvider: ['$stateParams', '$http','$q', function ($stateParams,$http,$q) {
			   var defer =  $q.defer();
		   	   $http
		           .get('../../module/extend/'+$stateParams.moduleId+'/'+$stateParams.page+'/render/')
		           .then(function(response) {
		               defer.resolve(response.data);
		           });
		   	return defer.promise;
		   }],
		   controller: 'addClassifyCtrl'
		 })
		.state('info-classifyEdit', {
				key:'info|class-detail|edit',
			url: '/info-classifyEdit?id&isLink&moduleId&name&page',
			templateUrl: 'addClassify.html',		
			controller: 'addClassifyCtrl'
		})
		;
	}
	
]);

angular.module('infoApp').directive('leftInformation',['$compile', function($compile) {
	return {
		restrict: 'ACE',
		transclude:true,
		template:'<div ng-transclude=""></div>',
		link: function (scope, element) {
			var showInput = function showInput(){
				element.find('button').hide();
				element.find('.left-info').show();
			};

			var inputNgModel = $(element.find('.form-control[ng-model],.form-control[data-ng-model]')[0]).data('$ngModelController');
			var orginRender = inputNgModel.$render;
			inputNgModel.$render = function render(){
				var viewValue = inputNgModel.$viewValue;
				if(viewValue){
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


infoApp.factory('commonTool',function() {
	return {
		getLocalTime: function() {
			var today=new Date();
			var y=today.getFullYear();
			var mh = today.getMonth()+1;
			var d= today.getDate();
			var h=today.getHours();
			var m=today.getMinutes();
			return y+'-'+mh+'-'+d+' '+h+':'+m;
		}
	}
});
