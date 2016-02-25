var pageEditApp = angular.module('pageEditApp', ['common']);

pageEditApp.controller('pageCtrl', ['$scope', '$state', 'utils','platformModalSvc',function($scope, $state, utils, platformModalSvc) {
	$scope.projPageData = projPageData;
	
	//弹出区块定制编辑窗口
	$scope.edit = function(projBlkId) {
		$scope.projBlkId = projBlkId;
		$state.go("blkEdit");
	};
	//备份页面效果
	$scope.backup = function() {
		if($scope.projPageData.bakConf.bak.length >= 1){
			$scope.disabled = true;
		}
		$scope.projPageData.bakConf.bak.push(new Date().getTime());
	};
	//删除页面效果备份
	$scope.delBackup = function(idx) {
		$scope.projPageData.bakConf.bak.splice(idx, 1);
		$scope.disabled = false;
	};
	//对比效果
	$scope.compare = function(){

	}
	//保存页面设计
	$scope.savePageDesign = function(){
		platformModalSvc.showWarmingMessage('保存页面设计','提示');
	}
	//退出页面设计
	$scope.outPageDesign = function(){
		platformModalSvc.showWarmingMessage('退出页面设计','提示');
	}
}]);

pageEditApp.controller('blkCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
	//过滤页面状态
	if(!$scope.projBlkId){
		$state.go('page');
		return;
	}
	//获取区块配置信息
	$http.get('../json/pageEdit.json')
		.success(function(data) {
	    	if(data.isSuccess){
	    		$scope.tplDate = data.data[$scope.projBlkId];
	    	}else{
	    		platformModalSvc.showWarmingMessage('获取数据失败：' + data.data,'提示');
	    	}
	    })
	    .error(function(data, status, headers, config) {
	    	platformModalSvc.showWarmingMessage('系统异常或网络不给力！','提示');
	    });
	
	$scope.save = function() {
	};

	$scope.cancel = function() {
	};

	//切换选中模板
	$scope.tplSelected = function(val){
		if(val && val == $scope.tplDate.tplId){
			return;
		}
		$scope.tplDate.tplId = val;
		$scope.tplDate.conf = $scope.tplDate.tplList[val].conf;
		$scope.tplDate.tplDs = $scope.tplDate.tplList[val].tplDs;
	};
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
	}).state('blkEdit', {
		url: '/blkEdit',
		views: {
			'blkEdit': {
				templateUrl: 'blkEdit.html',
				controller: 'blkCtrl'
			}
		}
	});
}]);