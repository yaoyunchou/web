var productApp = angular.module('productApp', ['ui.tree','common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox']);


productApp.run(['$rootScope','$location','$http', function($rootScope,$location,$http) {   
	$rootScope.rootHttp = function(){
		$http({
			method: 'GET',
			url: '/pccms/module/extend/list/tree',
			
		}).success(function(data, status, headers, config) {
		
	    	if(data.isSuccess){
	    		$rootScope.menus = data.data;
	    		console.log( data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	console.log('系统异常或网络不给力！');
	    });
	}
	$rootScope.rootHttp();
	$rootScope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //下面是在menus完成后执行的js
      menulist();      
	});
}]);



productApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	
		$urlRouterProvider.otherwise('/list');
		$stateProvider.state('list', { //产品列表
			url: '/list',///list?moduleId&name&page
			templateUrl: 'list.html',
			controller: 'listCtrl'
		}).state('addproduct', {//产品录入
			url: '/add-product',
			templateUrl: 'edit.html',
			controller: 'editCtrl'
		})
		.state('addproductclass', {//产品分类录入
			url: '/add-productClass',
			templateUrl: 'addClassify.html',
			controller: 'addClassifyCtrl'
		})
		.state('productclass-Edit', { 
			 url: '/classifyEdit?id&isLink&moduleId&name&page',
			 templateUrl: 'addClassify.html',		
			controller: 'addClassifyCtrl'
		})
		
		
		.state('productClassList', {//产品列表
			url: '/class-list',
			templateUrl: 'classify.html',
			controller: 'classifyCtrl'
		})
		.state('product-edit', { 
			url: '/product-edit?id&isLink&moduleId&name&page',
			templateUrl: 'edit.html',		  
			controller: 'editCtrl'
		})
		.state('add', { 
			url: "/product-add",
			templateUrl: 'edit.html',			  
			controller: 'editCtrl'
		})
	}
]);


angular.module('productApp').directive('leftInformation', function() {
	 return {
       restrict : 'ACE',
       replace : true,        
       scope : {},
       link : function(scope, element, attrs) { 
				element.find('button').bind('click',function(){					
				$(this).hide();
				element.find('.left-info').show();
			});        	
		}
   }
});


productApp.factory('commonTool',function() {
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

/************
* 加载menu的点击动画效果  
* a.添加angularjs 在menu 遍历完时的监控
* b.当menu遍历完成时候  加载动画js menulist()
* **********/

productApp.directive('onFinishRenderFilters', function ($timeout) {
   return {
       restrict: 'A',
       link: function(scope, element, attr) {
           if (scope.$last === true) {
               $timeout(function() {
                   scope.$emit('ngRepeatFinished');
               });
           }
       }
   };
});


productApp.directive('reloadWhenClick',['$location','$route', function ($location,$route) {
	   return {
	       restrict: 'A',//仅通过属性识别
	       link: function(scope, element, attr) {
	    	   var href=element.attr("href");
	    	   element.on("click",function(){
	    		   //href为#url，$location.path()的值为/url
                   if (href.substring(1) === $location.path().substring(1)) {
                       $route.reload();
                   }
	    	   })
	       }
	   };
	}]);
