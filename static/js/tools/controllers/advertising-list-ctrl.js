
/**
 * Created by yinc on 2016/1/14.
 */

(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('advertisingCtrl', ['$scope', '$http','$state', 'advertisingSvc','platformModalSvc',
		function ($scope, $http,$state, advertisingSvc, platformModalSvc) {
		var advDataList = $scope.advDataList = {};
		$scope.advFitlerOptions = advertisingSvc.advFitlerOptions;
		$scope.advSearch = false;
		$scope.totalItems = 0; //总条数
		$scope.currentPage = 1; //当前页，默认第一页
		$scope.pageSize = 10; //每页显示多少条
		$scope.maxSize = 5; //设置分页条的长度。

		var listLoaded = function listLoaded(data){
			$scope.advDataList = data.list;
			$scope.totalItems = data.totalItems;
		};

		$scope.catalogListOptions = {
			caption: '广告分类管理',
			onSelectedChanged: advertisingSvc.setSelectCatalog,
			data: {
				dataList: $scope.dataList,
				selectedItem: advertisingSvc.getSelectCatalog(),
				sortBy: 'orderBy',
				displayField: 'name',
				getSelectCatalog:angular.noop
			}
		};

		//右侧分类列表
		advertisingSvc.getCtgAdvList(true).then(function (data) {
			$scope.dataList = data;
			if($scope.catalogListOptions.setData) {
				$scope.catalogListOptions.setData(data);
			}else{
				$scope.catalogListOptions.data.dataList = data;
			}
		});

		//新增
		$scope.newAddAdv = function newAddAdv(){
			$state.go('advertising-edit');
		};

		//高级
		$scope.advancedBtn = function advancedBtn(){
			$scope.advSearch = !$scope.advSearch;
			advertisingSvc.getCtgAdvList(true).then(function(data){
				$scope.collectionAdvanced = data;
				//设置初始值
				$scope.activeItemAdvanced = {
					_id: data[0]._id,
					name:data[0].name
				};
			});
		};

		//搜索
		$scope.searchInfoAdv = function searchInfoAdv(){
			var searchInfo = {};
			searchInfo.name = $scope.name || '';
			advertisingSvc.searchInfoAdv(searchInfo);
		};

		//高级搜索
		$scope.advancedSearchAdv = function advancedSearchAdv(advFitlerOptions){
			advertisingSvc.advancedSearchAdv(advFitlerOptions);
		};

		//全选
		$scope.checkAll = function checkAll() {
			$scope.isCheckAll = !$scope.isCheckAll;
			angular.forEach($scope.advDataList, function(data){
				data.isChecked = $scope.isCheckAll;
			});
		};

		//反选
		$scope.inverse = function inverse(){
			angular.forEach($scope.advDataList, function(data){
				if (data.isChecked) {
					data.isChecked = false;
					$scope.isCheckAll = false;
				} else {
					data.isChecked = true;
					$scope.isCheckAll = true;
				}
				if (data.length != $scope.advDataList.length) {
					$scope.isCheckAll = false;
				} else {
					$scope.isCheckAll = true;
				}
			});
		};

		//批量删除
		$scope.deleteBatch = function deleteBatch(){
			//var ids = _.filter($scope.advDataList,{isChecked:true}).map('_id').join(',');
			var idArr = [];
			angular.forEach($scope.advDataList, function(data){
				if (data.isChecked) {
					idArr.push(data._id);
				}
			});

			advertisingSvc.delAdv(idArr.join(',')).then(function(data){
				platformModalSvc.showSuccessTip(data);
			});
		};

		//单行删除
		$scope.delAdv = function delAdv(id){
			advertisingSvc.delAdv(id);
		};
		
		//修改
		$scope.saveAdv = function saveAdv(item){
			$state.go('advertising-edit',{id:item._id});
		};
		
		//单行选中
		$scope.checkItem = function (item) {
			item.isChecked = !item.isChecked;
			$scope.isCheckAll = checkAllList();
		};

		//检查是否全选
		function checkAllList() {
			var flag = true;
			if ($scope.advDataList.length === 0) {
				flag = false;
			} else {
				angular.forEach($scope.advDataList, function(data){
					if (!data.isChecked) {
						flag = false;
						return false;
					}
				});
			}
			return flag;
		};

		//显示、隐藏
		$scope.display = function (item) {
			item.isDisplay = !item.isDisplay;
			advertisingSvc.save(item);
		};

		//分页
		$scope.pageChanged = function pageChanged(item){
			var obj = {};
			obj.pageNum = $scope.currentPage;
			obj.pageSize = $scope.pageSize;
			advertisingSvc.pageChanged(obj);
		};

		$scope.extractAdvLib = function extractAdvLib(){
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/tools/partials/advertising-lib.html',
				controller: 'advLibCtrl',
				size: 'lg'
			});
		};

		advertisingSvc.listLoaded.register(listLoaded);

		$scope.$on('$destroy',function(){
			advertisingSvc.listLoaded.unregister(listLoaded);
		});
	}]);
}(angular));

