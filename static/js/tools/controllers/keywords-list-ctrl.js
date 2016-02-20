/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('keywordsListCtrl', ['$scope', '$http', 'keywordsSvc', 'keywordsCatalogSvc','platformModalSvc', function ($scope, $http, keywordsSvc, keywordsCatalogSvc,platformModalSvc) {
		$scope.totalItems = 0; //总条数
		$scope.currentPage = 1; //当前页，默认第一页
		$scope.pageSize = 10; //每页显示多少条
		$scope.maxSize = 5; //设置分页条的长度
		//添加
		$scope.addKeyeordSrv = function addKeyeordSrv() {
			var bean = {
				'name': $scope.keywordsSvcname,
				'url': $scope.keywordsSvcurl,
				 'moduleId': keywordsCatalogSvc.getSelected().moduleId,
			};
			keywordsSvc.saveCreate(bean).then(function(data){
				if(data.isSuccess){
					platformModalSvc.showSuccessTip(data.data);
					$scope.keywordsSvcname = '';
					$scope.keywordsSvcurl = '';
					$scope.formOnlineServiceName.$setPristine();
				}else{
					platformModalSvc.showWarmingTip(data.data);
				}
			});

		};

		//編輯关键词
		$scope.editOnlineSvcModal = function editOnlineSvcModal(item) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/tools/partials/keywords-edit.html',
				controller: 'keyWordsEditCtrl',
				size: 'lg',
				userTemplate:true,
				options:{
					item: item
				}
			});
		};

		//删除
		$scope.remove = function remove(item) {
			keywordsSvc.remove(item);
		};

		//全选、反选
		$scope.checkAll = function checkAll(value) {	
			$scope.isCheckAll = value;
			keywordsSvc.checkAll(value);
		};

		//批量删除
		$scope.batchDelete = function batchDelete() {
			keywordsSvc.batchDelete();
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

		var onListLoaded = function onListLoaded(data) {
			$scope.isCheckAll = false;
			$scope.tabDataList = data;
			$scope.totalItems = data.totalItems;
		};

		//上下排序
		$scope.interchange = function interchange(item1, item2) {
			keywordsSvc.interchange(item1, item2);
		};

		$scope.ifShow = function ifShow(item) {
			keywordsSvc.ifShow(item);
		};

		//搜索
		$scope.search = function search(filter){
			var obj = {};
			obj.pageNum = $scope.currentPage||1;
			obj.pageSize = $scope.pageSize||10;
			obj.param = filter;
			keywordsSvc.getDataList(obj);
		};

		//分页
		$scope.pageChanged = function pageChanged(){
			var obj = {};
			obj.pageNum = $scope.currentPage||1;
			obj.pageSize = $scope.pageSize||10;
			keywordsSvc.getDataList(obj);
		};


		$scope.catalogListOptions = {
			caption: '分类管理',	
			onSelectedChanged: keywordsCatalogSvc.setSelectCatalog,
			data: {
				dataList: [],
				displayField: 'name',
				selectedItem: angular.noop
			},
			formOptions:{}
		};


		var catalogLoaded = function catalogLoaded(catalogData){
			if ($scope.catalogListOptions.setData) {
				catalogData = _.map(catalogData,function(item){
					item.id = item.moduleId;
					return item;
				});
				$scope.catalogListOptions.setData(catalogData);
			}else{
				$scope.catalogListOptions.data.dataList = catalogData;
			}
		};

		keywordsCatalogSvc.getDataList();
		keywordsCatalogSvc.listLoaded.register(catalogLoaded);
		keywordsSvc.listLoaded.register(onListLoaded);

		$scope.$on('$destroy',function(){
			keywordsSvc.listLoaded.unregister(onListLoaded);
			keywordsCatalogSvc.listLoaded.unregister(catalogLoaded);
		});
	}])
}(angular));
