var pageEditApp = angular.module('pageEditApp', ['platform','common','ui.nested.combobox'])
//var pageEditApp = angular.module('pageEditApp', ['common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox'])

pageEditApp.controller('pageCtrl', ['$scope', '$state','$compile', '$http', 'utils','platformModalSvc', function($scope, $state,$compile, $http, utils,platformModalSvc) {

}]);

pageEditApp.config(['$stateProvider', '$urlRouterProvider', '$sceProvider', function ($stateProvider, $urlRouterProvider, $sceProvider) {
	//设置html序列化不过滤style属性
	$sceProvider.enabled(false);
	$urlRouterProvider.otherwise('/');
    $stateProvider.state('page', {
		url: '/',
		views: {
			'blkEdit': {
				template: ''
			}
		}
	});
}]);


/*
 * 20151031 解决模板编辑页面在加入div.tpl-blk 后出现的页面混乱问题
 * author：yaoyunchou
 * 
 * 
 * 
 */
function tofix(){
	try
	{
		$(".tpl-blk,.tpl-blk *").css("box-sizing","content-box");
		console.log($(".tpl-blk").css("width"));
		$(".tpl-blk").each(function(){
			$(this).css("padding","0px").css("margin","0px");
			if($(this).width()+parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right"))+2==$(this).parent().width()){
				$(this).css("width",(($(this).width()+parseInt($(this).css("padding-left"))+parseInt($(this).css("padding-right")))-2)+"px");
				
			}
			
			;
		})
		$(".tpl-blk .ng-binding").each(function(){
			
				 if($(this).children().length>1){
			    	  console.log($(this).children()[0]);
			    }else{
			    		$(this).parent().addClass($(this).children()[0].className);
			    }
			
		  
		   
		})
	}
	catch (e)
	{
	   
	} 
}
setTimeout(function(){
	tofix();
},1000)


