var publishApp = angular.module('publishApp', ['ui.tree','platform','common','ng.ueditor','ui.bootstrap','ui.bootstrap.pagination','ui.nested.combobox']);

//网站发布
publishApp.controller('publishCtrl', ['$scope', '$http','$q', '$state', 'utils', '$timeout','platformModalSvc',function($scope, $http,$q, $state, utils,$timeout,platformModalSvc) {
	var timestamp;//时间戳
	var timer;//定时器
	var loading = 0;//进度标示

	function getLastPublishTime(){
		$http({
			method: 'GET',
			url: '/pccms/publish/publishTime'//获取上次更新时间
		}).then(function(data) {
			if(data.data.data && data.data.data!='null'){
				$scope.publishTime = data.data.data;
			}else{
				$scope.publishTime = '无'
			}
		});
	};

	getLastPublishTime();

	var startProgress = function startProgress(){
		$scope.progress = true;//取消按钮、进度条显示
		$scope.pmask = true;
		updateProgress().then(function(result){
			clearInterval(timer);
			$scope.pmask = false;
			if(result.isSuccess){
				tip(result.tag);
				getLastPublishTime();
			}else{
				platformModalSvc.showSuccessTip(result.tag);
			}
		});
	};

	$scope.publishAll = function publishAll(){
		platformModalSvc.showConfirmMessage('发布预计30分钟左右，确认发布吗？','提示').then(function(){
			timestamp = new Date().getTime();
			$scope.sty = {width: '0%'};
			startProgress();
			$http({
				method: 'GET',
				url: '/pccms/publish',
				params: {'taskId': timestamp, 'channelIds': '','publishType':'publishAll'}
			});
		});
	};

	function updateProgress() {
		var defer = $q.defer();
 		var update =function() {
		    $http({
			    method: 'GET',
			    url: '/pccms/progress/common?taskId=' + timestamp,
		    }).then(function (data) {
			    if (data.data.data.percent == 100) {
				    $scope.wd = 100 + "%";
				    $scope.sty = {width: '100%'};
				    defer.resolve({isSuccess: true, tag: timestamp, timer: timer});
			    } else if (data.data.data.percent < 98 && data.data.data.percent >= 0) {
				    $scope.wd = data.data.data.hint + "%";
				    $scope.sty = {width: data.data.data.percent + '%'};
			    }

			    if (data.data.data.percent >= 98 && data.data.data.percent < 100) {
				    loading = (loading + 1) % 4;
				    $scope.wd = data.data.data.hint + "%" + '  ' + '......'.slice(0, loading);
				    $scope.sty = {width: data.data.data.percent + '%'};
				    $scope.fileName = data.data.fileName;
			    } else if (data.data.data.percent == 0 && data.data.data.status != -1) {
				    $scope.wd = data.data.data.hint;
			    } else if (data.data.data.status == -1 || data.data.data.percent == -1) {
					$scope.progress = false;
					$scope.wd = data.data.data.hint;
					defer.resolve({isSuccess: false, tag: data.data.data.hint});
			    }
		    });
	    }
		timer = setInterval(update, 500);
		return defer.promise;
	};

	$scope.publishCancled = function(){//发布取消
		platformModalSvc.showConfirmMessage('确认取消吗？', '提示', true).then(function () {
			clearInterval(timer);
			$scope.pmask = false;
			$scope.progress = false;//取消、进度条隐藏
			$http({
				method: 'GET',
				url: '/pccms/publish/cancelPublish',
				params: {'taskId': timestamp}
			}).then(function (data) {
				window.location.href = globals.basAppRoot +'temp/publish/index.html#/';
			});
		});
	};

	//发布成功后的弹框提示
	function tip(timestamp){
		platformModalSvc.showModal({
			backdrop: 'static',
			templateUrl: globals.basAppRoot + 'temp/publish/publish-success-tip.html',
			controller: 'publishSuccessTipCtrl',
			size: 'lg',
			userTemplate:true,
			options:{
				timestamp:timestamp,
			}
		}).then(function(){
			$scope.progress = false;
			platformModalSvc.showSuccessTip('上传完成!');
		});
	};
	
	
}]).controller('publishSuccessTipCtrl', ['$scope','platformModalSvc', '$modalInstance', '$http', 'utils', '$animate', '$state', '$stateParams',
	function ($scope, platformModalSvc, $modalInstance, $http, utils, $animate, $state, $stateParams){
	$http({
		method: 'GET',
		url: '/pccms/publish/getDomainAddress',
		params: {'taskId': $scope.modalOptions.timestamp}
	}).then(function(data){
		$scope.datalist = data.data;
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
