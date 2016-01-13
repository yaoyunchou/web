//频道扩展。
infoApp.controller('channelCtrl', ['$scope', '$http', '$state', 'utils','$modal','platformModalSvc', function($scope,$http, $state, utils,$modal,platformModalSvc) {
	
	getExtendList();
	//加载列表数据
	function getExtendList(params){
		$http({
			method: 'GET',
			url: '/pccms/module/extend/list/all',
			params: params
		}).success(function(data, status, headers, config) {			
	    	if(data.isSuccess){	    		
	    		if(data.data){
	    			$scope.modules = data.data;
	    			
//	    			$scope.dataList = data.data.list;
//	    			$scope.totalItems = data.data.totalItems;
	    		}else{
//	    			$scope.dataList = [];
//	    			$scope.totalItems = 0;
//            		$scope.currentPage = 0;
	    			platformModalSvc.showWarmingMessage('暂无数据','提示');
	    			return;
	    		}
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
	};
	
	
	$scope.copyModule = function(params){
		if(params.isDisabled){
			platformModalSvc.showWarmingMessage('你访问的被锁了！','提示');
		}else{
			$http.post('/pccms/module/extend', params)
			.success(function(data, status, headers, config) {
		    	if(data.isSuccess){
		    		getExtendList();
		    	}else{
		    		platformModalSvc.showWarmingMessage(data.data,'提示');
		    	}
		    }).error(function(data, status, headers, config) {
		    	//alert('系统异常或网络不给力！');
		    });
			
		}				
	} 
	
	
	$scope.lockinfo = function(params) {
		module=params;
		$modal.open({
			templateUrl: 'lockinfo.html?module=',
			controller: 'lockinfoCtrl',
			backdrop: 'static',
			size: 'md'
		});	
    };
   

	$scope.delModule = function(params){		

			$http({
				method: 'DELETE',
				url: '/pccms/module/extend/'+params._id,
				params: {}
			}).success(function(data, status, headers, config) {
		    	if(data.isSuccess){
				    $scope.$emit('onMenuUpdated');
		    		getExtendList();
		    	}else{
		    		platformModalSvc.showWarmingMessage(data.data,'提示');
		    	}
		    }).error(function(data, status, headers, config) {
		    	//alert('系统异常或网络不给力！');
		    });
		
		
	} 

	$scope.addChannel = function() {	
		$modal.open({
			templateUrl: 'addChannelmodalBox.html',
			controller: 'addChannelmodalBoxCtrl',
			backdrop: 'static',
			size: 'md'
		});
	};
	
  
}])
.controller('lockinfoCtrl', ['$scope', '$modalInstance', '$http','$state','platformModalSvc', function($scope,$modalInstance,$http,$state,platformModalSvc) {
	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
    $scope.updModule = function(){
		if(module.isDisabled == true){
			module.isDisabled = false;
		}else{
			module.isDisabled = true;
		}
		
		$http.put('/pccms/module/extend/'+module._id, module)
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
			    $scope.$emit('onMenuUpdated');
	    		$state.go('channel',null,{reload:true});
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
		$modalInstance.close();
	} 


}])

//添加频道
.controller('addChannelmodalBoxCtrl', ['$scope' ,'$modalInstance', '$http','$state','platformModalSvc', function($scope,$modalInstance,$http,$state,platformModalSvc) {

	$scope.ok = function() {
		$modalInstance.close();
	};

	$scope.cancel = function() {
		$modalInstance.dismiss();
	};
	  /********添加频道**************/	
	$scope.addModule = function(){		
		$http.post('/pccms/module/extend/',$scope.formData)
		.success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		//getExtendList();
	    		$modalInstance.close();
			    $scope.$emit('onMenuUpdated');
	    		$state.go('channel',null,{reload:true});
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
		
	} 
}]);


//分类配置。
infoApp.controller('categoryCtrl', ['$scope','$state','$http','$stateParams','platformModalSvc',function($scope,$state,$http,$stateParams,platformModalSvc) {
	
	$scope.pagename = $stateParams.page=="ctg"? "分类配置":"文章配置";

	$scope.fromData={};
	$scope.infoBases;
	$scope.infoSEOs = [];
	$scope.todata = function(obj,value){
		 obj.isShow=value;
	
	}
	/********分类配置start**************/
	$scope.getHttp = function(){
		$http({
			method: 'GET',
			url: "/pccms/module/extend/"+$stateParams.moduleId+"/compotent",
			params: {'page':$stateParams.page }
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		$scope.basedata = data.data;
	    		$scope.infoBases = data.data.infoBase;
	    		$scope.infoSeos = data.data.infoSeo;
	    		$scope.infoOthers = data.data.infoOther;
	    		
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
	}
	$scope.getHttp();
	  /********分类配置end**************/	
	
	  /********提交修改start**************/
	$scope.changeOK = function(){
		$http({
			method: 'PUT',
			url: '/pccms/module/extend/compotent',
			data: $scope.basedata
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		//alert('成功！');
	    	}else{
	    		platformModalSvc.showWarmingMessage(data.data,'提示');
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
	}
	  /********提交修改end**************/
	
	
	/********  其他属性  新建 end**************/
	$scope.addtype = function() {	
		$modal.open({
			templateUrl: 'addProperty.html',
			controller: 'addOtherTypeCtrl',
			backdrop: 'static',
			size: 'md'
		});	
     };
     /********其他属性  新建end**************/	

	
 
	

}]);

//文章配置。
infoApp.controller('airticleCtrl', ['$scope', function($scope) {

	

}]);

//其他属性添加
infoApp.controller('addOtherTypeCtrl', ['$rootScope', function($rootScope) {

	

}]);




//路由配置、
infoApp.config(['$stateProvider', '$urlRouterProvider',
                function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/channel');
	$stateProvider.state('channel', { //频道扩展。
		url: '/channel',
		templateUrl: 'channel.html',
		controller: 'channelCtrl'
	}).state('category', { //分类配置。
		url: '/category?moduleId&page',
		templateUrl: 'category.html',
		controller: 'categoryCtrl'
	}).state('airticle', { //文章配置。
		url: '/airticle',
		templateUrl: 'airticle.html',
		controller: 'airticleCtrl'
	})			
}
]);



