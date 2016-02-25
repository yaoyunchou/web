/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var seoApp = angular.module("seoApp");
	seoApp.factory('siteMapListSvc', ['$q', '$http', 'platformMessenger', 'platformModalSvc', 'siteMapCatalogSvc', function ($q, $http, PlatformMessenger, platformModalSvc, siteMapCatalogSvc) {
		var service = {},
			listLoaded = new PlatformMessenger(),
		//保存tab 列表
			serviceList;

		//获取tab list 数据
		service.getTabDataList = function getTabDataList() {
			var selectedCatalog = siteMapCatalogSvc.getSelectCatalog();
			var defer = $q.defer();
			if (selectedCatalog) {
				// $http.get('/pccms/siteMap/getSiteMapListByType?name=' + selectedCatalog.name + '')
				$http({
					'method': 'POST',
					'url': '/pccms/siteMap/getSiteMapListByType',
					'data': selectedCatalog
				}).then(function (response) {
					serviceList = response.data.data || [];
					serviceList = _.sortBy(serviceList, 'orderBy');
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

		//添加link
		service.addLink = function addLink(data) {
			$http({
				'method': 'POST',
				'url': '/pccms/siteMap/addSiteMap',
				'data': data
			}).then(function (response) {

				if (response.data.isSuccess) {
					service.getTabDataList();
					platformModalSvc.showSuccessTip("添加成功!");
				} else {
					platformModalSvc.showSuccessTip(response.data.data);
				}

			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
		};
		//删除link方法
		service.deletOnlineSvcFactory = function deletOnlineSvcFactory(data) {
			$http({
				method: 'POST',
				url: globals.basAppRoot + 'siteMap/deleteLink',
				data: data
			}).then(function (response) {
				platformModalSvc.showSuccessTip(response.data.data);
				service.getTabDataList();
			});
		};
		//将需要删除的客服id 组成数组
		service.deleteLinks = function deleteLinks() {

		};
		service.deletSingleOnlineSvc = function deletSingleOnlineSvc(item) {
			service.deletOnlineSvcFactory({"ids": item._id});

		};
		//编辑客服
		service.editOnlineSvcModal = function editOnlineSvcModal(item) {
			platformModalSvc.showModal({
				backdrop: 'static',
				templateUrl: globals.basAppRoot + 'js/seo/partials/seo-link-edit.html',
				controller: 'siteMapItemEditCtrl',
				size: 'lg',
				userTemplate: true,
				options: {
					item: angular.copy(item),
				}
			});
		};
		//编辑客服信息
		service.editOnlineSvc = function editOnlineSvc(item) {
			$http({
				'method': 'POST',
				'url': '/pccms/siteMap/updateLink/',
				'data': item
			}).then(function () {
				service.getTabDataList();
			});
		};
		//客服排序
		service.sortItem = function sortItem(data) {
			$http({
				method: 'GET',
				url: '/pccms/siteMap/orderBySiteMap',
				params: data
			}).then(function () {
				service.getTabDataList();
			});
		};
		service.interchange = function movUp(item1, item2) {
			var data = {};
			data.id = item1._id;
			data.id2 = item2._id;
			service.sortItem(data);
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
			service.deletOnlineSvcFactory({"ids": strList});
		};
		//显示删除
		service.ifShow = function ifShow(item) {
			item.isDisplay = !item.isDisplay;
			service.editOnlineSvc(item);
		};
		//搜索
		service.searchLink = function searchLink(name) {
			var defer = $q.defer();
			if (name) {
				$http({
					'method': 'POST',
					'url': '/pccms/siteMap/seachSiteMapListByLinkName?name=' + name,
					'data': siteMapCatalogSvc.getSelectCatalog()
				}).then(function (response) {
					defer.resolve(response.data.data);
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			}
			// $http.get('/pccms/siteMap/seachSiteMapListByLinkName')

			return defer.promise;
		};
		service.registerListLoaded = function registerListLoaded(handler) {
			listLoaded.register(handler);
		};

		service.unregisterListLoaded = function unregisterListLoaded(handler) {
			listLoaded.unregister(handler);
		};
		siteMapCatalogSvc.registerUpdatadone(service.getTabDataList);
		return service;
	}]);
}(angular));