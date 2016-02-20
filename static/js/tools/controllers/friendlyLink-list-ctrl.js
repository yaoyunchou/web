/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('friendlyLinkListCtrl', ['$scope', '$http', 'friendlyLinkSvc', 'platformModalSvc', function ($scope, $http, friendlyLinkSvc, platformModalSvc) {
		$scope.totalItems = 0; //总条数
		$scope.currentPage = 1; //当前页，默认第一页
		$scope.pageSize = 10; //每页显示多少条
		$scope.maxSize = 5; //设置分页条的长度
		$scope.addKeyeordSrv = function addKeyeordSrv() {
			var bean = {
				'name': $scope.name,
				'url': $scope.url,
			};
			friendlyLinkSvc.saveCreate(bean).then(function(data){
				if(data.isSuccess){
					platformModalSvc.showSuccessTip(data.data);
					$scope.name = '';
					$scope.url = '';
					$scope.formOnlineServiceName.$setPristine();
				}else{
					platformModalSvc.showWarmingTip(data.data);
				}
			});
		};

		//编辑友情链接
		$scope.friendlyLinkSave = function friendlyLinkSave(item) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/tools/partials/friendlyLink-edit.html',
				controller: 'friendlyLinkEditCtrl',
				size: 'lg',
				userTemplate: true,
				options: {
					item: item
				}
			});
		};


		$scope.remove = function remove(item) {
				friendlyLinkSvc.remove(item);
		};


		$scope.checkAll = function checkAll(value) {
			$scope.isCheckAll = value;
			friendlyLinkSvc.checkAll(value);
		};

		//单行选中
		$scope.checkItem = function (item) {
			item.isChecked = !item.isChecked;
			$scope.isCheckAll = checkAllList();
		};

		//检查是否全选
		function checkAllList() {
			var flag = true;
			if ($scope.tabDataList.list.length === 0) {
				flag = false;
			} else {
				angular.forEach($scope.tabDataList.list, function(data){
					if (!data.isChecked) {
						flag = false;
						return false;
					}
				});
			}
			return flag;
		};

		$scope.batchDelete = function batchDelete() {
			friendlyLinkSvc.batchDelete();
		};


		var onListLoaded = function onListLoaded(data) {
			$scope.isCheckAll = false;
			$scope.tabDataList = data;
			$scope.totalItems = data.totalItems;
		};


		$scope.interchange = function interchange(item1, item2) {
			friendlyLinkSvc.interchange(item1, item2);
		};

		
		$scope.ifShow = function ifShow(item) {
			friendlyLinkSvc.ifShow(item);
		};


		$scope.search = function search(filter) {
			var obj = {};
			obj.pageNum = $scope.currentPage||1;
			obj.pageSize = $scope.pageSize||10;
			obj.name = $scope.filter || '';
			friendlyLinkSvc.getDataList(obj);
		};

		//分页
		$scope.pageChanged = function pageChanged(){
			var obj = {};
			obj.pageNum = $scope.currentPage||1;
			obj.pageSize = $scope.pageSize||10;
			obj.name = $scope.filter || '';
			friendlyLinkSvc.getDataList(obj);
		};

		friendlyLinkSvc.getDataList();
		friendlyLinkSvc.listLoaded.register(onListLoaded);
		$scope.$on('$destroy', function () {
			friendlyLinkSvc.listLoaded.unregister(onListLoaded);
		});
	}]);
}(angular));
