/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.factory('onlineServiceSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger','onlineServiceCatalogSvc', function ($q, $http, platformModalSvc, PlatformMessenger,onlineServiceCatalogSvc) {
		var service = {},
			listLoaded = new PlatformMessenger(),
		//保存tab 列表
			serviceList;

		//获取tab list 数据
		service.getTabDataList = function getTabDataList() {
			var selectedCatalog =onlineServiceCatalogSvc.getSelectCatalog();
			var defer = $q.defer();
			if (selectedCatalog) {
				$http.get('/pccms/onlineSrvList?id=' + selectedCatalog.id + '').then(function (response) {
					serviceList = response.data.data||[];
					serviceList = _.sortBy(serviceList,'orderBy');
					defer.resolve(serviceList);
					listLoaded.fire(serviceList);
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			}
			return defer.promise;
		};
		service.getServiceList = function getServiceList() {
			return serviceList;
		};

		//添加在线客服
		service.addOnlineSrv = function addOnlineSrv(data) {
			$http({
				'method': 'POST',
				'url': '/pccms/addOnlineSrv',
				'data': data
			}).then(function (response) {
				service.getTabDataList();
				platformModalSvc.showSuccessTip(response.data.data);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
		};
		//删除客服方法
		service.deletOnlineSvcFactory = function deletOnlineSvcFactory(data) {
			$http({
				method: 'DELETE',
				url: globals.basAppRoot + 'deleteOnlineSrv',
				params: data
			}).then(function (response) {
				platformModalSvc.showSuccessTip(response.data.data);
				service.getTabDataList();
			});
		};
		//将需要删除的客服id 组成数组
		service.deletOnlineSvc = function deleOnlineSvc() {

		};
		service.deletSingleOnlineSvc = function deletSingleOnlineSvc(item) {
			service.deletOnlineSvcFactory({"ids": item._id});

		};
		//编辑客服
		service.editOnlineSvcModal = function editOnlineSvcModal(item,dataList) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/tools/partials/online-service-edit.html',
				controller: 'editOnlineSvcCtrl',
				size: 'lg',
				userTemplate: true,
				options: {
					item: item,
					dataList:dataList
				}
			});
		};
		//编辑客服信息
		service.editOnlineSvc = function editOnlineSvc(item) {
			$http({
				'method': 'PUT',
				'url': '/pccms/updateOnlineSrv/' + item._id,
				'data': item
			}).then(function (response) {
				service.getTabDataList();
			});
		};
		//客服排序
		service.sortItem = function sortItem(data) {
			$http({
				method: 'PUT',
				url: '/pccms/updateOrder',
				params: data
			}).then(function () {
				service.getTabDataList();
			});
		};
		service.interchange = function movUp(item1, item2) {
			var data={};
			data.id1 = item1._id;
			data.id2 = item2._id;
			data.deptId = onlineServiceCatalogSvc.getSelectCatalog().id;
			service.sortItem(data);

		};
		//全选
		service.checkAll = function checkAll(){
			angular.forEach(serviceList, function (item) {
				item.isChecked = true;
			});
		};
		//反选
		service.inverse = function inverse(){
			angular.forEach(serviceList, function (item) {
				item.isChecked = !item.isChecked;
			});
		};
		//表头选择按钮
		service.radioTop = function radioTop(e){
			angular.forEach(serviceList, function (item) {
				item.isChecked = e;
			});
		};
		//批量删除
		service.batchDelete = function batchDelete(){
			var strList ='';
			angular.forEach(serviceList, function (item) {
				if(item.isChecked){
					if(strList){
						strList = strList+','+item._id;
					}else{
						strList = strList+item._id;
					}

				}
			});
			service.deletOnlineSvcFactory({"ids": strList});
		};
		//显示删除
		service.ifShow = function ifShow(item){
			item.isDisplay = !item.isDisplay;
			service.editOnlineSvc(item);
		};
		service.registerListLoaded = function registerListLoaded(handler) {
			listLoaded.register(handler);
		};

		service.unregisterListLoaded = function unregisterListLoaded(handler) {
			listLoaded.unregister(handler);
		};
		onlineServiceCatalogSvc.registerUpdatadone(service.getTabDataList);
		return service;
	}]);
}(angular));