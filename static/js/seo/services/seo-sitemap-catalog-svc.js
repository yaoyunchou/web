/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var seoApp = angular.module("seoApp");
	seoApp.factory('siteMapCatalogSvc', ['$q', '$http', 'platformMessenger', 'platformModalSvc', function ($q, $http, PlatformMessenger, platformModalSvc) {
		var service = {},
			updatadone = new PlatformMessenger(),
			navListLoaded = new PlatformMessenger(),
		//保存tab 列表
			serviceList,
		//保存部门的选中对象
			selectedCatalog;
		service.getServiceList = function getServiceList() {
			return serviceList;
		};
		service.init = function init() {
			var defer = $q.defer();
			$http({
				'method': 'GET',
				'url': '/pccms/siteMap/getIsFirstInMap'
			}).then(function (response) {
				if(response.data==='true'){
					platformModalSvc.showConfirmMessage('是否要初始化html网站地图?','提示').then(function(data){
						defer.resolve(true);
					},function(){
						defer.resolve(false);
					});
				}else{
					defer.resolve(true);
				}
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
			return defer.promise;
		};
		//添加右侧部门
		service.addDept = function addDept(data) {
			var defer = $q.defer();
			$http({
				'method': 'POST',
				'url': '/pccms/siteMap/addLinkType',
				'data': data
			}).then(function (response) {
				if (response.data.isSuccess) {
					deptList.push(response.data.data);
					defer.resolve(deptList);
					service.getCtgDetpList(true);
					platformModalSvc.showSuccessTip("添加成功!");
				}else{
					platformModalSvc.showWarmingTip(response.data.data)
				}

			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
			return defer.promise;
		};
		//修改右侧部门
		service.updataDept = function updataDept(data) {
			var defer = $q.defer();
			$http({
				'method': 'POST',
				'url': '/pccms/siteMap/updateLinkType',
				'data': data
			}).then(function (response) {
				if (response.data.isSuccess) {
					// deptList.push(response.data.data);
					defer.resolve(deptList);
					//service.getCtgDetpList(true);
					platformModalSvc.showSuccessTip("更新成功!");
				}

			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
			return defer.promise;
		};
		/*左侧列表*/
		var deptList;
		service.getCtgDetpList = function getCtgDetpList(flog) {
			var defer = $q.defer();
			$http.get('/pccms/siteMap/getInfoLinkType?isMade=' + flog).then(function (response) {
				deptList = response.data.data || [];
				deptList = _.sortBy(deptList, 'orderBy');

				if (flog) {
					service.setSelectCatalog(deptList[0]);
				}
				defer.resolve(deptList);
				navListLoaded.fire(deptList);
			}, function (response) {
				if (!response.data.isSuccess) {
					platformModalSvc.showWarmingTip(response.data.msg);
				}
			});
			return defer.promise;
		};

		//删除部门  optimized
		service.deletCatalog = function deletCatalog(catalog) {
			var massage = '确认要删除' + catalog.name + '网站地图频道吗?删除后当前频道里面的链接将全部删除,建议先将链接转移频道.';
			platformModalSvc.showConfirmMessage(massage, '网站操作信息提示').then(function () {
				$http.get('/pccms/siteMap/deleteLinkType?id=' + catalog.id).then(function (response) {
					if (response.data.isSuccess) {
						platformModalSvc.showSuccessTip(response.data.data);
						_.remove(deptList, {_id: catalog});
						service.getCtgDetpList(true);
					}else{
						platformModalSvc.showWarmingTip(response.data.data);
					}
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.msg);
				});
			});
		};

		//删除部门
		service.deletDetp = function deletDetp(id, index) {
			$http.delete('/pccms/deleteOnlineSrvDept?deptId=' + id).then(function (response) {
				if (response.data.isSuccess) {
					platformModalSvc.showSuccessTip(response.data.data);
					deptList.splice(index, 1);
					service.getCtgDetpList();
				}
			}, function (response) {
				service.getCtgDetpList();
				platformModalSvc.showWarmingTip(response.data.msg);
			});
		};

		//部门排序
		service.sortCtg = function sortCtg(data) {
			$http({
				method: 'GET',
				url: '/pccms/siteMap/orderBySiteMapType',
				params: data
			}).then(function () {
				service.getCtgDetpList(false);
			});
		};
		//交换排序字段 optimized
		service.switchSortIndex = function switchSortIndex(item1, item2) {
			service.sortCtg({id: item1.id, id2: item2.id});
		};
		//获取选中部门对象
		service.getSelectCatalog = function getSelectCatalog() {
			return selectedCatalog || {};
		};
		//设置选中部门对象
		service.setSelectCatalog = function setSelectCatalog(catalog) {
			selectedCatalog = catalog;
			updatadone.fire(selectedCatalog);

		};

		service.registerNavListLoaded = function registerNavListLoaded(handler) {
			navListLoaded.register(handler);
		};
		service.registerUpdatadone = function registerUpdatadone(handler) {
			updatadone.register(handler);
		};

		service.unregisterNavListLoaded = function unregisterNavListLoaded(handler) {
			navListLoaded.unregister(handler);
		};
		service.unregisterUpdatadone = function unregisterUpdatadone(handler) {
			updatadone.unregister(handler);
		};
		return service;
	}]);
}(angular));