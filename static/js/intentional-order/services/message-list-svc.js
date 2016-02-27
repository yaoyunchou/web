/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var intentionalOrderApp = angular.module("intentionalOrderApp");
	intentionalOrderApp.factory('messageListSvc', ['$q', '$http', 'platformMessenger', 'platformModalSvc', 'messageCatalogSvc', function ($q, $http, PlatformMessenger, platformModalSvc, messageCatalogSvc) {
		var service = {},
			listLoaded = new PlatformMessenger(),
			pageLists = new PlatformMessenger(),
		//保存tab 列表
			serviceList,pageNum,pageSize;

		service.setPageNum = function setPageNum(a) {
			pageNum = a;
		};
		service.getPageNum = function getPageNum(){
			return pageNum;
		};
		//console.log(pageNum);
		service.setPageSize = function setPageSize(a) {
			pageSize = a;
		};
		service.getPageSize = function getPageSize(){
				return pageSize;
		};
		//searchItem={orderTypeId:messageCatalogSvc.getSelectCatalog()._id};
		var searchItem = {};
		//初始化searchItem

		service.getSeachItem = function getSeachItem(){
			if(!searchItem.formId){
				searchItem.formId = messageCatalogSvc.getSelectCatalog()._id;
			}
			return searchItem;
		};
		service.setSeachItem = function setSeachItem(item){
			if(item){
				searchItem = item;
				searchItem.formId = messageCatalogSvc.getSelectCatalog()._id;
			}else{
				searchItem.formId = messageCatalogSvc.getSelectCatalog()._id;
			}
			service.setPageNum(1);
			service.getTabDataList();
		};
		//获取tab list 数据
		service.getTabDataList = function getTabDataList() {
			var selectedCatalog = messageCatalogSvc.getSelectCatalog();
			var defer = $q.defer();
			//searchItem.orderTypeId = selectedCatalog._id;
			if (selectedCatalog._id&&searchItem.formId) {
				$http({
					method: 'PUT',
					url: '/pccms/intentionalOrder/list/paging?pageNum='+service.getPageNum()+'&pageSize='+service.getPageSize(),
					data: searchItem
				}).then(function (response) {
						serviceList = response.data.data || [];
						serviceList.list = _.sortBy(serviceList.list, 'orderBy');
						defer.resolve(serviceList);
						//pageLists.fire()
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
		//添加link
		service.addOrder = function addOrder(data) {
			$http({
				'method': 'POST',
				'url': '/pccms/intentionalOrder/add',
				'data': data
			}).then(function () {
				service.getTabDataList();
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
		};
		//删除message方法
		service.deletOnlineSvcFactory = function deletOnlineSvcFactory(data) {
			var defer= $q.defer();
			$http({
				method: 'DELETE',
				url: globals.basAppRoot + '/intentionalOrder/batchDel',
				params: data
			}).then(function (response) {
				defer.resolve(response.data);
				platformModalSvc.showSuccessTip(response.data.data);
				service.getTabDataList();
			});

			return defer.promise;
		};
		//批量设置已阅
		service.readSvcFactory = function readSvcFactory(data) {
			var defer= $q.defer();
			$http({
				method: 'PUT',
				url: globals.basAppRoot + 'intentionalOrder/updForIsRead/'+data,
				//params: data,
				data:{isRead:true}
			}).then(function (response) {
				defer.resolve(response.data);
				service.getTabDataList();
			});
			return defer.promise;
		};
		service.deletSingleOrderSvc = function deletSingleOrderSvc(item) {
			platformModalSvc.showConfirmMessage('确认要删除当前留言信息到回收站吗?','网站操作信息提示').then(function(){
				service.deletOnlineSvcFactory({"intentionalOrderIds": item._id}).then(function(data){
				});
			});
		};
		//编辑message
		service.editzOrderModal = function editzOrderModal(item) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/intentional-order/partials/message-reply-edit.html',
				controller: 'messageReplyCtrl',
				size: 'lg',
				userTemplate: true,
				options: {
					item: angular.copy(item)
				}
			});
		};
		//编辑客服信息
		service.editOrdereSvc = function editOrdereSvc(item) {
			var newitem = _.omit(item, ['_id']);
			/*item = _.slice(item,1);
			console.log(item);*/
			$http({
				'method': 'PUT',
				'url': '/pccms/intentionalOrder/update/'+item._id+'',
				'data': newitem
			}).then(function () {
				service.getTabDataList();
			});
		};

		//全选
		service.checkAll = function checkAll() {
			angular.forEach(serviceList.list, function (item) {
				item.isChecked = true;
			});
		};
		//反选
		service.inverse = function inverse() {
			angular.forEach(serviceList.list, function (item) {
				item.isChecked = !item.isChecked;
			});
		};
		//表头选择按钮
		service.radioTop = function radioTop(e) {
			angular.forEach(serviceList.list, function (item) {
				item.isChecked = e;
			});
		};
		//批量删除
		service.batchDelete = function batchDelete() {
			var strList = '';
			angular.forEach(serviceList.list, function (item) {
				if (item.isChecked) {
					if (strList) {
						strList = strList + ',' + item._id;
					} else {
						strList = strList + item._id;
					}

				}
			});
			if(strList!=='') {
				platformModalSvc.showWarmingMessage('确认要删除这些留言信息到回收站吗?', '网站操作信息提示').then(function(){
				service.deletOnlineSvcFactory({"intentionalOrderIds": strList}).then(function (data) {
					if (data.isSuccess) {
						platformModalSvc.showSuccessTip(data.data);
					}else{
						platformModalSvc.showWarmingTip(data.data)
					}
				})
			   });
			}
			;
		};
		//批量可阅
		service.batchRead = function batchRead() {
			var strList = '';
			angular.forEach(serviceList.list, function (item) {
				if (item.isChecked) {
					if (strList) {
						strList = strList + ',' + item._id;
					} else {
						strList = strList + item._id;
					}

				}
			});
			if(strList!==''){
				service.readSvcFactory(strList).then(function(data){
					if(data.isSuccess){
						platformModalSvc.showWarmingTip(data.data);
					}
				});
			}

		};
		//显示删除
		service.ifShow = function ifShow(item) {
			item.isDisplay = !item.isDisplay;
			service.editOnlineSvc(item);
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
		service.registerListLoaded = function registerListLoaded(handler) {
			listLoaded.register(handler);
		};

		service.unregisterListLoaded = function unregisterListLoaded(handler) {
			listLoaded.unregister(handler);
		};
		service.registerPageLists = function registerPageLists(handler) {
			pageLists.register(handler);
		};

		service.unregisterPageLists = function unregisterPageLists(handler) {
			pageLists.unregister(handler);
		};
		messageCatalogSvc.registerUpdatadone(service.setSeachItem);

		return service;
	}]);
}(angular));