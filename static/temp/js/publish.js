var publishApp = angular.module('publishApp', ['ui.tree','platform','common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox']);

//网站发布
publishApp.controller('publishCtrl', ['$scope', '$http', '$state', 'utils', '$timeout','platformModalSvc',function($scope, $http, $state, utils,$timeout,platformModalSvc) {
	
	$scope.start = true;//发布入口显示
	$scope.startPublish = false;//发布列表页面 隐藏
	$scope.home = false;//发布列表页面 隐藏
	$scope.pulishBtn = true;//发布按钮 显示
	$scope.homePulishBtn = true;//发布按钮 显示
	$scope.publishTip = false;//发布后的提示信息  隐藏
	$scope.pauseBtn = $scope.timesBtn = $scope.homeTimesBtn = $scope.progress = false;//暂停、取消、进度条 隐藏
	$scope.publishBtn = true;
	//发布首页提示数目
	$http({
		method: 'GET',
		url: '/pccms/publish/publishIndex',
	}).success(function(data) {
		if(data.isSuccess){
			$scope.channel = data.totalModule;
			$scope.page = data.totalArticle;
			$scope.indexPagePublish = data.indexPagePublish;
			if($scope.channel> 0 || $scope.page> 0){
				$scope.publishBtn = false;
			}else{
				$scope.publishBtn = true;
			} if($scope.indexPagePublish == true){
				$scope.indexPagePublishBtn = false;
				$scope.indexPageNum =1;
			}else{
				$scope.indexPagePublishBtn = true;
				$scope.indexPageNum =0;
			}
		}
    }).error(function(data, status, headers, config) {
    	//alert('系统异常或网络不给力！');
    });

	//勾选
	$scope.checkAll = function(){
		$scope.isCheckAll = !$scope.isCheckAll;
		for(var key in $scope.dataList){
			var item = $scope.dataList[key];
			item.isChecked = $scope.isCheckAll;
		}
	};
	
	//单行选中
	$scope.checkItem = function(item){
		item.isChecked = !item.isChecked;
		$scope.isCheckAll = checkAllList();
	};

	//检查是否全选
	function checkAllList(){
		var flag = true;
		if($scope.dataList.length == 0){
			flag = false;
		}else{
			for(var key in $scope.dataList){
				var item = $scope.dataList[key];
				if(!item.isChecked){
					flag = false;
					break;
				}
			}
		}
		return flag;
	};
	
	
	$scope.retSummary = function(){//返回汇总
		$state.go('publish');
		$scope.start = true;//发布入口显示
		$scope.startPublish = false;//发布列表页面 隐藏
	};
	
	$scope.channelPublished = function(){//频道发布列表
		$scope.start = false;
		$scope.startPublish = true;
		$http({
			method: 'GET',
			url: '/pccms/publish/list',
			params: {'pageSize': 20, 'pageNum': 1}
		}).success(function(data) {
	    	if(data.isSuccess){
	    		$scope.dataList = data.data.list;
	    		$scope.totalItems = data.data.totalItems;
	    	}else{
		    	//alert('获取失败！'+data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
	};
	
	
	var processCount = 0, loading=0;//进度
	function updateClock(f) {//执行逻辑
		$http({
			method: 'GET',
			url: '/pccms/progress/common?taskId='+timestamp,//获取发布日志
		}).success(function(data) {
			if(data.data.percent == 100) {
				$scope.w = data.data.hint +"%";
		    	$scope.style = {width:'100%'};
		    	clearInterval(timer);
				$scope.$watch('style.width', function(newOptions, oldOptions) {
					if(newOptions === '100%'){
						//$timeout(function(){
						clearInterval(timer);
							tip(timestamp,f);//瞬间弹出发布成功后的域名展示
						//},3000);
						getPublishChannelLog();
					}		
				}, true);
			}else if(data.data.percent < 98 && data.data.percent>1){
				$scope.w = data.data.hint + "%";
		    	$scope.style = {width: data.data.percent+'%'};
			}
			if(data.data.percent >= 98 && data.data.percent < 100 ){
				 loading = (loading + 1)%4;
				$scope.w = data.data.hint + "%" +'  '+ '......'.slice(0,loading);
		    	$scope.style = {width: data.data.percent+'%'};
		    	$scope.publishTips = true;//发布按钮下面的提示信息隐藏
		    	$scope.fileName = data.data.fileName;
			}else if(data.data.percent == 0 && data.data.status != -1){
				$scope.w = data.data.hint;
			}else if(data.data.status == -1){
				$scope.w = data.data.hint;
		    	$scope.style = {width: data.data.percent+'%'};
		    	clearInterval(timer);
			}
			
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });  
     };
     
     //发布频道完毕后，数据条目的更新
     function getPublishChannelLog(){
    	 $http({
				method: 'GET',
				url: '/pccms/publish/getPublishLog',
				params: {'taskId': timestamp}
			}).success(function(data, status, headers, config){		
				$scope.publishTip = false;//发布按钮下面的提示信息隐藏
				$scope.pauseBtn = $scope.timesBtn = $scope.pulishBtn = false;//暂停、取消、发布按钮 隐藏
				$scope.progress = true;//此时进度条显示100%
				$scope.sucPage = data.sucPage;//成功个数
				$scope.failDetails = data.failDetails;//失败个数
				$scope.unPublishedPage = data.unPublishedPage;//未发布完成个数
				$scope.totPage = data.totPage;//总个数
		 });
     };
     
     var timestamp;//时间戳
 	 var timer;//定时器
 	 var idArr = [];
 	/**
 	  * 去除数组重复元素
 	  */
 	 function uniqueArray(data){
 	   data = data || [];  
 	   var a = {};  
 	   for (var i=0; i<data.length; i++) {  
 	       var v = data[i];  
 	       if (typeof(a[v]) == 'undefined'){  
 	            a[v] = 1;  
 	       }  
 	   };  
 	   data.length=0;  
 	   for (var i in a){
			data[data.length] = i;
       }
		return data;
 	}  
 	 
	$scope.published = function(){//点击开始发布
 		$scope.w = '';
		$scope.style = '';
		timestamp = new Date().getTime();
 		for(var key in $scope.dataList){
 			var item = $scope.dataList[key];
 			if(item.isChecked){
 				idArr.push(item._id);
 				uniqueArray(idArr);
 			}
 		};
 		if(idArr.length<=0){
 			platformModalSvc.showWarmingMessage('请选择频道名称！', '提示');
 			return;
 		}else{
 			$scope.pulishBtn = false;//发布按钮  隐藏
 			$scope.pauseBtn = $scope.timesBtn = $scope.progress = true;//暂停、取消、进度条显示
 			$scope.publishTip = false;//发布后的提示信息 隐藏
 		    $http({
 				method: 'GET',
 				url: '/pccms/publish',//点击发布
 				params: {'taskId': timestamp, 'channelIds': idArr.join(','),'publishType':'increment'}
 			}).success(function(data, status, headers, config) {	
 				
 							
 		    }).error(function(data, status, headers, config) {
 		    	//alert('系统异常或网络不给力！');
 		    });
 		}
 		updateClock(false);
 		timer = setInterval(function(){updateClock(false)}, 500);
 	};
 	
	//发布成功后的弹框提示
	function tip(timestamp,f){
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: globals.basAppRoot + 'temp/publish/publish-success-tip.html',
			controller: 'publishSuccessTipCtrl',
			size: 'lg',
			userTemplate:true,
			options:{
				timestamp:timestamp,	
			}
		}).then(function(datalist){
			if(f){//首页发布
				if(datalist.length > 0){
					$scope.homePulishBtn = true;//发布按钮显示
					$scope.homeTimesBtn = $scope.homeProgress= false;//取消、进度条 隐藏
					$scope.homePublishTip = true;//发布后的提示信息 显示
				}else{
					$scope.homePulishBtn = false;//发布按钮隐藏
					//window.location.href = "/pccms/temp/publish/index.html#/";
					window.location.href = globals.basAppRoot + "/pccms/temp/publish/index.html#/";
				}
			}else{//频道、内页发布
				if(datalist.length > 0){
					$scope.pulishBtn = true;//发布按钮显示
					$scope.pauseBtn = $scope.timesBtn = $scope.progress= false;//暂停、取消、进度条 隐藏
					$scope.publishTip = true;//发布后的提示信息 显示
					idArr = [];//发布成功后，清空数组
					$scope.channelPublished();
				}else{
					$scope.pulishBtn = false;//发布按钮隐藏
					//window.location.href = "/pccms/temp/publish/index.html#/";
					window.location.href = globals.basAppRoot + "/pccms/temp/publish/index.html#/";
				}
			}
			
			/*if(!$scope.$$phase) {
				$scope.$apply();
			}*/
	    });
	};
	
	$scope.publishPaused = function(){//发布暂停
		platformModalSvc.showWarmingMessage(nsw.Constant.PAUSE,nsw.Constant.TIP,true).then(function(){
			$scope.published();
		},function(){
			$scope.pauseBtn = $scope.timesBtn = $scope.progress = false;//暂停、取消、进度条 隐藏
			$scope.pulishBtn = true;//发布按钮 显示
			$scope.publishTip = true;//发布后的提示信息 显示
		});
	};  
	
	$scope.publishCancled = $scope.homePublishCancled = function(f){//发布取消
		$http({
			method: 'GET',
			url: '/pccms/publish/cancelPublish',
			params: {'taskId': timestamp}
		}).success(function(data){
			if(data.isSuc){
				platformModalSvc.showConfirmMessage('确认取消吗？','提示',true).then(function(){
					clearInterval(timer);
					if(f){//首页
						$scope.homeTimesBtn = $scope.homeProgress= false;//取消、进度条 隐藏
						$scope.homePulishBtn = true;//发布按钮显示
						$scope.homePublishTip = true;//发布后的提示信息 显示
					}else{//频道、内页
						$scope.pauseBtn = $scope.timesBtn = $scope.progress = false;//暂停、取消、进度条 隐藏
						$scope.pulishBtn = true;//发布按钮 显示
						$scope.publishTip = true;//发布后的提示信息 显示
					}
				},function(){
					timer = setInterval(function(){
						updateClock(f);
					},1000);
				});
			};
		}).error(function(data, status, headers, config) {
			//platformModalSvc.showWarmingMessage('系统异常或网络不给力！');
		});
	};
	
	//域名展示弹框后的取消
	/*$scope.cancelTpl = function(){
		$scope.pulishBtn = false;//发布按钮隐藏
		$scope.pauseBtn = $scope.timesBtn = $scope.progress = false;//暂停、取消、进度条 隐藏
		$scope.publishTip = true;//发布后的提示信息 显示		
		//$scope.sucPage = data.sucPage;//成功个数
		//$scope.failDetails = data.failDetails;//失败个数
		//$scope.unPublishedPage = data.unPublishedPage;//未发布完成个数
		//$scope.totPage = data.totPage;//总个数
	};*/
	
	
	/*
	 * 
	 * 以下是首页发布
	 * */
	
	var homeProcessCount = 0, loading = 0;//首页进度
 	function homeUpdateClock(f) {//首页执行逻辑
 		$http({
			method: 'GET',
			url: '/pccms/progress/common?taskId='+timestamp,//获取发布日志
		}).success(function(data, status, headers, config) {
			if(data.data.percent == 100) {
				$scope.wd = 100 +"%";
				$scope.sty = {width:'100%'};
				$scope.$watch('sty.width', function(newOptions, oldOptions) {
					if(newOptions === '100%'){
						clearInterval(timer);
						//$timeout(function(){
							tip(timestamp,f);//瞬间弹出发布成功后的域名展示
						//},3000);
						$http({
							method: 'GET',
							url: '/pccms/publish/getPublishLog',
							params: {'taskId': timestamp}
						}).success(function(data, status, headers, config){		
							$scope.homePublishTip = false;//发布按钮下面的提示信息隐藏
							$scope.homePauseBtn = $scope.homeTimesBtn = $scope.homePulishBtn = false;//暂停、取消、发布按钮 隐藏
							$scope.homeProgress = true;//此时进度条显示100%
							$scope.homeSucPage = data.sucPage;//成功个数
							$scope.homeFailDetails = data.failDetails;//失败个数
							$scope.homeUnPublishedPage = data.unPublishedPage;//未发布完成个数
							$scope.homeTotPage = data.totPage;//总个数
						});
					}		
				}, true);
			}else if(data.data.percent < 98 && data.data.percent>1){
				$scope.wd = data.data.hint + "%";				
		    	$scope.sty = {width: data.data.percent+'%'};
			}
			if(data.data.percent >= 98 && data.data.percent < 100 ){
				loading = (loading + 1)%4;
				$scope.wd = data.data.hint + "%" +'  '+ '......'.slice(0,loading);
		    	$scope.sty = {width: data.data.percent+'%'};
		    	$scope.publishTips = true;//发布按钮下面的提示信息隐藏
		    	$scope.fileName = data.data.fileName;
			}else if(data.data.percent == 0 && data.data.status !=-1){
				$scope.wd = data.data.hint;
			}else if(data.data.status ==-1){
				$scope.wd = data.data.hint;
				clearInterval(timer);
			}	
			
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
    };
    
    
    $scope.indexPublished = function(){//点击发布首页
   	    $scope.start = false;
   	    $scope.home = true;
   	    $http({
			method: 'GET',
			url: '/pccms/publish/publishIndexList',
			params: {'pageSize': 20, 'pageNum': 1}
		}).success(function(data, status, headers, config) {
	    	if(data.isSuccess){
	    		$scope.dataList = data.data;
	    	}else{
		        //alert('获取失败！'+data.data);
	    	}
	    }).error(function(data, status, headers, config) {
	    	//alert('系统异常或网络不给力！');
	    });
    };
   
     $scope.homePublished = function(){//点击开始网站首页发布
    	// $scope.homeProgress = true;
    	 homeUpdateClock(true);//进度条显示进度
 	     timestamp = new Date().getTime();
 	     var idArr = [];
 		 for(var key in $scope.dataList){
 			 var item = $scope.dataList[key];
 			 if(item.isChecked){
 				idArr.push(item._id);
 			}
 		};
 		if(idArr.length<=0){
 			platformModalSvc.showWarmingMessage('请选择要发布的首页！', '提示');
 			return;
 		}else{
 			$scope.homePulishBtn = false;//发布按钮  隐藏
		    $scope.homeTimesBtn = $scope.homeProgress = true;//取消、进度条显示
 			$scope.publishTip = false;//发布后的提示信息 隐藏
 		    $http({
 				method: 'GET',
 				url: '/pccms/publish',//点击发布
 				params: {'taskId': timestamp,'publishType':'main','channelIds':''}
 			}).success(function(data, status, headers, config) {				
 							
 		    }).error(function(data, status, headers, config) {
 		    	//alert('系统异常或网络不给力！');
 		    });
 		}
 		//homeUpdateClock(true);
		timer = setInterval(function(){homeUpdateClock(true)}, 500);
     };
	
     $scope.homeRetSummary = function(){//返回汇总
 		$state.go('publish');
 		$scope.start = true;//首页发布入口显示
 		$scope.home = false;//首页发布列表页面 隐藏
 	};
	
}]).controller('publishSuccessTipCtrl', ['$scope','platformModalSvc', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams',
    function ($scope, platformModalSvc, $modalInstance, $http, utils, $animate, $state, $stateParams){
	$http({
		method: 'GET',
		url: '/pccms/publish/getDomainAddress',
		params: {'taskId': $scope.modalOptions.timestamp}
	}).success(function(data, status, headers, config){
		$scope.datalist = data; //module:$scope.moduleOptions.module
	});
 
	$scope.cancelTpl = function(){//取消
		$scope.closeModal(true, $scope.datalist);//弹框隐藏
	};
}]);

//回收站，路由配置
publishApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider.state('publish', {
			url: '/',
			templateUrl: 'publish.html',
			controller: 'publishCtrl'
		});
	}]);
