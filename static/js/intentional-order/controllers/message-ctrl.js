/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function(angular){
	"use strict";
	var intentionalOrderApp = angular.module("intentionalOrderApp");
	intentionalOrderApp.controller('messageCtrl',['$scope','messageCatalogSvc','messageListSvc','platformMessenger',function($scope,messageCatalogSvc,messageListSvc,platformMessenger){
		//$scope.isCheckAll =false;
		//设置单元个数
		var maxSize =2;
		messageListSvc.setPageNum(1);
		messageListSvc.setPageSize(maxSize);
		messageCatalogSvc.getCtgDetpList(true).then(function(data){
			$scope.dataList =data.list;
			//$scope.bigCurrentPage = data;
		});
		var navListLoaded = function navListLoaded(data) {
			$scope.dataList = data;
			if ($scope.catalogListOptions.setData) {
				$scope.catalogListOptions.setData(data);
			}
		};
		messageCatalogSvc.registerNavListLoaded(navListLoaded);

		$scope.$on('$destroy', function () {
			//onlineService.unregisterListLoaded(onListLoaded);
			messageCatalogSvc.unregisterNavListLoaded(navListLoaded);
		});
		$scope.catalogListOptions = {
			caption: '意向订单分类',
			onSelectedChanged: messageCatalogSvc.setSelectCatalog,
			/*onSorted: onlineServiceCatalog.switchSortIndex,
			onDeleted: onlineServiceCatalog.deletCatalog,

			onCreated: onlineServiceCatalog.addDept,
			onLineEdited: onlineServiceCatalog.addDept,*/
			data: {
				dataList: $scope.dataList,
				displayField: 'name',
				selectedItem: messageCatalogSvc.getSelectCatalog()
			},formOptions: {}
		};


		//表单list
		//messageListSvc.getTabDataList();
		var onListLoaded = function onListLoaded(data) {
			$scope.tabDataList = data.list;
			$scope.bigTotalItems = data.totalItems*10/maxSize;
		};
		//編輯在線客服
		$scope.editzOrderModal = function editzOrderModal(item) {
			messageListSvc.editzOrderModal(item);
		};
		$scope.ifShow = function ifShow(item) {
			item.isDisplay = !item.isDisplay;
			messageListSvc.editOrdereSvc(item);
		};
		$scope.isRead = function isRead(item) {
			item.isRead = !item.isRead;
			messageListSvc.editOrdereSvc(item);
		};
		//删除单个
		$scope.deletSingleOrderSvc = function deletSingleOrderSvc(item) {
			messageListSvc.deletSingleOrderSvc(item);
		};
		$scope.checkAll = function checkAll() {
			messageListSvc.checkAll();
		};
		$scope.inverse = function inverse() {
			messageListSvc.inverse();
		};
		$scope.radioTop = function radioTop(e) {
			messageListSvc.radioTop(!e);
		};
		$scope.batchDelete = function batchDelete() {
			//platformMessenger.showConfirmMessage()
			messageListSvc.batchDelete();
		};
		$scope.batchRead = function batchRead() {
			messageListSvc.batchRead();
		};
		$scope.advancedSearch = false;
		$scope.advancedBtn = function advancedBtn(){
			$scope.advancedSearch = !$scope.advancedSearch;
		};
		$scope.searchContent = function searchContent(){
			messageListSvc.setSeachItem($scope.queryParams);
		};
		$scope.advancedSearchList = function advancedSearchList(){
			messageListSvc.setSeachItem($scope.advanced);
		};

		//分页
	/*	$scope.bigTotalItems = messageListSvc.getPage()*10;*/

		$scope.pageChanged = function pageChanged() {
			//console.log($scope.bigCurrentPage)
			messageListSvc.setPageNum($scope.bigCurrentPage);
			messageListSvc.getTabDataList();
		};

		messageListSvc.registerListLoaded(onListLoaded);
	}]);
}(angular));