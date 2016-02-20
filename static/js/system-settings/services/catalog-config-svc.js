/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module("systemSettingsApp");
	systemSettingsApp.factory('messageListConfigSvc', ['$q', '$http', 'platformMessenger', 'platformModalSvc', 'messageCatalogSvc', function ($q, $http, PlatformMessenger, platformModalSvc, messageCatalogSvc) {
		var service = {},
			listLoaded = new PlatformMessenger(),
			listsLoaded = new PlatformMessenger(),
		//保存tab 列表
			serviceList;

		//获取tab list 数据
		service.getTabDataList = function getTabDataList() {
			var selectedCatalog = messageCatalogSvc.getSelectCatalog();
			if (selectedCatalog._id) {
				$http({
					method: 'GET',
					url: '/pccms/orderForm/getFieldList?formId='+ selectedCatalog._id + ''
				}).then(function (response) {
					serviceList = response.data.data || [];
					serviceList = _.sortBy(serviceList, 'orderBy');
					listsLoaded.fire(serviceList);
					/*listLoaded.fire(serviceList);*/
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			}
		};
		service.getServiceList = function getServiceList() {
			return serviceList;
		};
		//获取列表信息
		service.getInfo = function getInfo(){
			var selectedCatalog = messageCatalogSvc.getSelectCatalog();
			//var defer = $q.defer();
			if (selectedCatalog._id) {
				$http({
					method: 'GET',
					url: '/pccms/orderForm/getFormInfo?formId='+ selectedCatalog._id + ''
				}).then(function (response) {
					var serviceLists = response.data.data || [];
					//serviceLists = _.sortBy(serviceLists, 'orderBy');

					listLoaded.fire(serviceLists);
					service.getTabDataList();
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			}
			//return defer.promise;
		};

		//添加field
		service.addfield = function addfield(data) {
			data = service.mapSaveData(data);
			var derfer = $q.defer();
			$http({
				'method': 'PUT',
				'url': '/pccms/orderForm/addField',
				'data': data
			}).then(function (response) {
				service.getTabDataList();
				platformModalSvc.showSuccessTip(response.data.msg);
				derfer.resolve()
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.msg);
			});
			return derfer.promise;
		};
		//过滤field 数据
		service.mapSaveData = function mapSaveData(data){
			if(data.formType ==='text'||data.formType ==='textarea'){
				if(!data.isVerify){
					data = _.omit(data,'select');
				}else{
					if(data.select!=='Reg'){
						//data = _.omit(data,'regular');
						data.regular = data.select;
					}
				}
				//dataoptionFields
			}else{
				data = _.omit(data,['length','isRequired','isVerify','select','regular','name','isSingle']);
			}
			if(!data.formType ==='text'){
				data = _.omit(data,'intentionFormEcho');
			}else{
				if(!data.intentionFormEcho){
					data = _.omit(data,['length','isRequired','isVerify','select','regular','name','isSingle']);
				}
			}
			return data;
		};
		//删除field方法
		service.deletOnlineSvcFactory = function deletOnlineSvcFactory(data) {
			data.formId = messageCatalogSvc.getSelectCatalog()._id;
			platformModalSvc.showConfirmMessage('你确定要删除这些字段信息吗?','网站操作信息提示').then(function(){
				$http({
					method: 'DELETE',
					url: globals.basAppRoot + '/orderForm/deleteField',
					params: data
				}).then(function (response) {
					platformModalSvc.showSuccessTip(response.data.msg);
					service.getTabDataList();
				});
			});


		};
		//将需要删除的客服id 组成数组
		service.deletSingleFieldSvc = function deletSingleFieldSvc(item) {
			service.deletOnlineSvcFactory({"fieldIds": item._id});

		};
		//编辑客服
		service.desigenerForm = function desigenerForm() {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'partials/message-form-designer-edit.html',
				controller: 'formDesignerCtrl',
				size: 'lg',
				userTemplate: true,
				options: {
					item: serviceList
				}
			});
		};
		//新增字段
		service.addFieldModal = function addFieldModal(data){
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'partials/message-form-add-field-edit.html',
				controller: 'addFieldCtrl',
				size: 'lg',
				userTemplate: true,
				options:{
					formId:messageCatalogSvc.getSelectCatalog()._id,
					data:angular.copy(data)
				}
			})
		};
		//投放留言表单
		service.getJSModal = function getJSModal(data){
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'partials/get-javascript-edit.html',
				controller: 'getJSCtrl',
				size: 'lg',
				userTemplate: true,
				options:{
					data:angular.copy(data)
				}
			})
		};
		//编辑字段
		service.addFieldTitleModal = function addFieldTitleModal(item){
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: 'partials/message-form-title-add-edit.html',
				controller: 'formTileCtrl',
				size: 'lg',
				userTemplate: true,
				options:{
					item:item
				}
			})
		};
		//编辑客服信息
		service.editFieldSvc = function editFieldSvc(item) {
			var fieldId =item._id;
			item = service.mapSaveData(item);
			item = _.omit(item,['_id']);
			$http({
				'method': 'PUT',
				'url': '/pccms/orderForm/updateFields/'+fieldId,
				'data': item
			}).then(function (response) {
				service.getTabDataList();
				platformModalSvc.showSuccessTip(response.data.data)
			});
		};
		//客服排序
		service.sortItem = function sortItem(data) {
			data.formId = messageCatalogSvc.getSelectCatalog()._id;
			$http({
				method: 'PUT',
				url: '/pccms/orderForm/updateFieldOrder',
				params: data
			}).then(function () {
				service.getTabDataList();
			});
		};
		//全选
		service.checkAll = function checkAll() {
			angular.forEach(serviceList, function (item) {
				item.isChecked = true;
			});
		};
		//反选
		service.inverse = function inverse() {
			angular.forEach(serviceList, function (item) {
				item.isChecked = !item.isChecked;
			});
		};
		//表头选择按钮
		service.radioTop = function radioTop(e) {
			angular.forEach(serviceList, function (item) {
				item.isChecked = e;
			});
		};
		//批量删除
		service.batchDelete = function batchDelete() {
			var strList = '';
			angular.forEach(serviceList, function (item) {
				if (item.isChecked) {
					if (strList) {
						strList = strList + ',' + item._id;
					} else {
						strList = strList + item._id;
					}

				}
			});
			service.deletOnlineSvcFactory({"fieldIds": strList});
		};
		//搜索
		service.searchLink = function searchLink(name) {
			var defer = $q.defer();
			// $http.get('/pccms/siteMap/seachSiteMapListByLinkName')
			$http({
				'method': 'POST',
				'url': '/pccms/siteMap/seachSiteMapListByLinkName?name=' + name,
				'data': messageCatalogSvc.getSelectCatalog()
			}).then(function (response) {
				defer.resolve(response.data.data);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
			return defer.promise;
		};

		//addOptionField
		service.isDefault = function isDefault(data){
			angular.forEach(data,function(item){
				item.isDefault = false;
			})
		};


		service.registerListLoaded = function registerListLoaded(handler) {
			listLoaded.register(handler);
		};

		service.unregisterListLoaded = function unregisterListLoaded(handler) {
			listLoaded.unregister(handler);
		};

		//getTabList
		service.registerListsLoaded = function registerListsLoaded(handler) {
			listsLoaded.register(handler);
		};

		service.unregisterListsLoaded = function unregisterListsLoaded(handler) {
			listsLoaded.unregister(handler);
		};
		messageCatalogSvc.registerUpdatadone(service.getInfo);

		return service;
	}]);
}(angular));