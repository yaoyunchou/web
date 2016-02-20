/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.factory('onlineServiceCatalogSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger', function ($q, $http, platformModalSvc, PlatformMessenger) {
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
		//添加右侧部门
		service.addDept = function addDept(data) {
			var defer = $q.defer();
			$http({
				'method': 'POST',
				'url': '/pccms/addDept',
				'data': data
			}).then(function (response) {
				if (response.data.isSuccess) {
					deptList.push(response.data.data);
					defer.resolve(deptList);
					service.getCtgDetpList();
					platformModalSvc.showSuccessTip("添加成功!");
				}else{
					platformModalSvc.showWarmingTip(response.data.msg);
				}
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.msg);
			});
			return defer.promise;
		};
		service.updata = function updata(data) {
			var defer = $q.defer();
			$http({
				'method': 'POST',
				'url': '/pccms/addDept',
				'data': data
			}).then(function (response) {
				if (response.data.isSuccess) {
					deptList.push(response.data.data);
					defer.resolve(deptList);
				}
				platformModalSvc.showSuccessTip(response.data.msg);
				service.getCtgDetpList(false);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.msg);
			});

			return defer.promise;
		};
		/*左侧列表*/
		var deptList;
		service.getCtgDetpList = function getCtgDetpList(flog) {
			var defer = $q.defer();
			$http.get('/pccms/ctgDetpList').then(function (response) {
				deptList = response.data.data||[];
				deptList = _.sortBy(deptList,'orderBy')
				if (flog) {
					service.setSelectCatalog(deptList[0]);
				}
				defer.resolve(deptList);
				navListLoaded.fire(deptList);
			}, function (response) {
				if(!response.data.isSuccess){
					platformModalSvc.showWarmingTip(response.data.msg);
				}
			});
			return defer.promise;
		};

		//删除部门  optimized
		service.deletCatalog = function deletCatalog(catalog) {
			$http.delete('/pccms/deleteOnlineSrvDept?deptId=' + catalog.id).then(function (response) {
				if (response.data.isSuccess) {
					platformModalSvc.showSuccessTip(response.data.data);
					_.remove(deptList,{id:catalog.id});
					navListLoaded.fire(deptList);
				}
			}, function (response) {
				service.getCtgDetpList();
				platformModalSvc.showWarmingTip(response.data.msg);
			});
		};

		//删除部门
		service.deletDetp = function deletDetp(id, index) {
			$http.delete('/pccms/deleteOnlineSrvDept?deptId=' + id).then(function (response) {
				if (response.data.isSuccess) {
					platformModalSvc.showSuccessTip(response.data.data);
					deptList.splice(index, 1);
				}
			}, function (response) {
				service.getCtgDetpList();
				service.getTabDataList();
				platformModalSvc.showWarmingTip(response.data.msg);
			});
		};

		//部门排序
		service.sortCtg = function sortCtg(data) {
			$http({
				method: 'PUT',
				url: '/pccms/updateCtgChildOrder',
				params: data
			}).then(function () {
				service.getCtgDetpList(false);
			});
		};
		//交换排序字段 optimized
		service.switchSortIndex = function switchSortIndex(item1, item2) {
			service.sortCtg({id1: item1.id, id2: item2.id});
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
		}

		service.unregisterNavListLoaded = function unregisterNavListLoaded(handler) {
			navListLoaded.unregister(handler);
		};
		service.unregisterUpdatadone = function unregisterUpdatadone(handler) {
			updatadone.unregister(handler);
		}
		return service;
	}]);
}(angular));