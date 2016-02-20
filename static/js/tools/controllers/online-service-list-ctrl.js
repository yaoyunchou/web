/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('onlineServiceCtrl', ['$scope', '$http', 'onlineServiceSvc', 'onlineServiceCatalogSvc', function ($scope, $http, onlineService, onlineServiceCatalog) {
		$scope.whiteSpace = false;
		$scope.rightNavTitle = "部门管理";
		$scope.addPlaceholder = "请填写部门名称";
		$scope.FatherAdd = function FatherAdd() {
			onlineServiceCatalog.addDept($scope.FatherBean).then(
				function (data) {
					$scope.dataList = data;
					$scope.FatherBean = {};
				}
			);
		};
		//加载nav list数据
		onlineServiceCatalog.getCtgDetpList(true).then(function (data) {
			$scope.dataList = data;
		});
		var navListLoaded = function navListLoaded(data) {
			if ($scope.catalogListOptions.setData) {
				$scope.dataList = data;
				$scope.catalogListOptions.setData(data);
			}else{
				$scope.catalogListOptions.data.dataList =data;
			}
		};
		$scope.deletDept = function deletDept(id, index) {
			onlineServiceCatalog.deletDetp(id, index);
		};
		$scope.addOnlineSrv = function addOnlineSrv() {
			var bean = {
				'name': $scope.onlineServicename,
				'dept': {
					'id': onlineServiceCatalog.getSelectCatalog().id,
					'name': onlineServiceCatalog.getSelectCatalog().name
				}
			};
			onlineService.addOnlineSrv(bean);
			$scope.onlineServicename = '';
			$scope.formOnlineServiceName.$setPristine(true);
		};
		$scope.gotoPage = function gotoPage(item) {
			if (!item.whiteSpace) {
				onlineServiceCatalog.setSelectCatalog(item);
			}
		};
		//編輯在線客服
		$scope.editOnlineSvcModal = function editOnlineSvcModal(item) {
			onlineService.editOnlineSvcModal(item, $scope.dataList);
		};
		//删除当个在线客服
		$scope.deletSingleOnlineSvc = function deletSingleOnlineSvc(item) {
			onlineService.deletSingleOnlineSvc(item);
		};
		$scope.checkAll = function checkAll() {
			onlineService.checkAll();
		};
		$scope.inverse = function inverse() {
			onlineService.inverse();
		};
		$scope.radioTop = function radioTop(e) {
			onlineService.radioTop(!e);
		};
		$scope.batchDelete = function batchDelete() {
			onlineService.batchDelete();
		};
		$scope.isCatalogSelected = function isCatalogSelected(catalog) {
			return catalog.id === onlineServiceCatalog.getSelectCatalog().id;
		};
		// ng-class="{selected:$scope.isCatalogSelected(item)}"

		var onListLoaded = function onListLoaded(data) {
			$scope.tabDataList = data;
		};
		$scope.interchange = function interchange(item1, item2) {
			onlineService.interchange(item1, item2);
		};

		$scope.switchSortIndex = function switchSortIndex(item1, item2) {
			onlineServiceCatalog.switchSortIndex(item1, item2);
		};
		$scope.movCtgDown = function movDown(item) {
			onlineService.movDown(item, 'ctg', $scope.dataList);
		};
		$scope.ifShow = function ifShow(item) {
			onlineService.ifShow(item);
		};
		$scope.whiteFun = function whiteFun(item) {
			if (!item.whiteSpace) {
				item.whiteSpace = true;
			} else {
				onlineServiceCatalog.addDept(item).then(function () {
					onlineService.getTabDataList();
				});
				item.whiteSpace = false;

			}
		};
		$scope.saveCtg = function saveCtg() {

		};


		onlineService.registerListLoaded(onListLoaded);
		onlineServiceCatalog.registerNavListLoaded(navListLoaded);
		$scope.tabDataList = onlineService.getServiceList(onlineServiceCatalog.getSelectCatalog().id);
		$scope.$on('$destroy', function () {
			onlineService.unregisterListLoaded(onListLoaded);
			onlineServiceCatalog.unregisterNavListLoaded(navListLoaded);
		});

		$scope.catalogListOptions = {
			caption: '部门管理',
			onSorted: onlineServiceCatalog.switchSortIndex,
			onDeleted: onlineServiceCatalog.deletCatalog,
			onSelectedChanged: onlineServiceCatalog.setSelectCatalog,
			onCreated: onlineServiceCatalog.addDept,
			onLineEdited: onlineServiceCatalog.updata,
			data: {
				dataList: $scope.dataList,
				sortBy: 'orderBy',
				displayField: 'name',
				selectedItem: onlineServiceCatalog.getSelectCatalog()
			},
			formOptions: {
				name: 'onLineCatalog',
				//是否显示label
				hasLabel: false,
				//beyong 对应的提示
				hasValidateTip: false,
				//初始化
				data: {},
				rows: [{
					label: '部门名称',
					domain: 'name',
					placeholder:'请填写部门名称',
					maxLength: 18,
					size: 12,
					model: 'name'
				}]
			}
		};

	}])
		.controller('editOnlineSvcCtrl', ['$scope', 'onlineServiceSvc', 'onlineServiceCatalogSvc', function ($scope, onlineService) {
			$scope.editBean = $scope.modalOptions.item;
			if(!_.has($scope.editBean,'serverType.name')){
				$scope.editBean.serverType={};
				$scope.editBean.serverType.name = 'QQ';
			}
			$scope.ctgList = $scope.modalOptions.dataList;
			$scope.defultName = $scope.ctgList[0];
			$scope.ok = function ok() {
				onlineService.editOnlineSvc($scope.editBean);
				$scope.closeModal(true);
			};
		}]);
}(angular));
