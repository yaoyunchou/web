/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module('systemSettingsApp');
	systemSettingsApp.factory('contactInfoSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger',
	                                     function ($q, $http, platformModalSvc, PlatformMessenger) {
		var service = {},serviceList;
		service.listLoaded = new PlatformMessenger(),
		//保存tab 列表

		//获取tab list 数据
		service.getDataList = function getDataList(filter) {	
			$http({
				url:'/pccms/contactInfo',params:{
			}}).then(function (response) {
				console.log(response.data.data);
				serviceList = response.data.data||service.createItem();				
				service.listLoaded.fire(serviceList);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});		
		};
		
		service.createItem = function createItem(){
			return {
				adress:'abc'
			};
		};
	
		//添加在线客服
		service.saveCreate = function saveCreate() {
			console.log("&&&&"+serviceList.formalDomain);
			var data = serviceList;
			$http({
				'method': 'PUT',
				'url': '/pccms/contactInfo',
				'data': data
			}).then(function (response) {
				service.getDataList();
				platformModalSvc.showSuccessTip(response.data.data);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
		};
		
		//编辑客服信息
		service.save = function save(data) {
			$http({
				'method': 'PUT',
				'url': '/pccms/friendlyLink/updStatus/' + data._id,
				'data': data
			}).then(function (response) {
				service.getDataList();
			});
		};
		
		//删除客服方法
		service.remove = function remove(data) {
			var ids =[];
			if(_.isObject(data)){
				ids.push(data._id);
			}else{
				ids = _.map(_.filter(serviceList.list,{isChecked:true}),'_id');
			}
			
			var param ={ids:ids.join(','),objName:'FriendlyLink'};
			$http({
				method: 'POST',
				url: globals.basAppRoot + '/recycleBin/addItem',
				data: param
			}).then(function (response) {
				platformModalSvc.showSuccessTip(response.data.data);
				service.getDataList();
				
			});
		};
		
		//编辑客服
		service.showEditModal = function showEditModal(item,dataList) {
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
	
		
		service.sortItem = function sortItem(item1, item2) {
			var data={};
			data.id1 = item1._id;
			data.id2 = item2._id;
			data.deptId = onlineServiceCatalogSvc.getSelectCatalog().id;
			service.sortItem(data);

		};
		//全选
		service.checkAll = function checkAll(checked){
			angular.forEach(serviceList.list, function (item) {
				item.isChecked = checked;
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
			
			service.remove();
		};
		
		
		//关键词排序
		service.sortItem = function sortItem(data) {
			$http({
				method: 'PUT',
				url: '/pccms/friendlyLink/sort',
				params: data
			}).then(function () {
				service.getDataList();
			});
		};
		
		service.interchange = function movUp(item1, item2) {
			var data={};
			data.id1 = item1._id;
			data.id2 = item2._id;
			service.sortItem(data);
		};
		
		
		//显示删除
		service.ifShow = function ifShow(item){
			item.isDisplay = !item.isDisplay;
			service.save(item);
		};
	
		
		return service;
	}]);
}(angular));