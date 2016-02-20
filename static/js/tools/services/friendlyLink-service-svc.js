/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.factory('friendlyLinkSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger',
		function ($q, $http, platformModalSvc, PlatformMessenger) {
			var service = {}, serviceList;
			service.listLoaded = new PlatformMessenger();
			service.filter = {pageNum:'',pageSize:'',name:''};
			//获取tab list 数据
			service.getDataList = function getDataList(filter) {
				$http({
					method: 'GET',
					url: '/pccms/friendlyLink',
					params: filter
				}).then(function (response) {
					serviceList = response.data.data || {};
					service.listLoaded.fire(serviceList);
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			};


			service.saveCreate = function saveCreate(data) {
				return $http({
					'method': 'POST',
					'url': '/pccms/friendlyLink',
					'data': data
				}).then(function (response) {
					service.getDataList();
					return response.data;
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			};

			//编辑友情链接
			service.friendlyLinkSave = function friendlyLinkSave(item) {
				var data = {'name': item.name, 'url': item.url};
				$http({
					'method': 'PUT',
					'url': '/pccms/friendlyLink/edit/' + item._id,
					'data': data
				}).then(function (res) {
					service.getDataList();
				});
			};

			service.remove = function remove(data) {
				var ids = [];
				if (_.isObject(data)) {
					ids.push(data._id);
				} else {
					ids = _.map(_.filter(serviceList.list, {isChecked: true}), '_id');
				}
				var param = {ids: ids.join(','), objName: 'FriendlyLink'};
				if(ids.length>0){
					platformModalSvc.showConfirmMessage('确定删除到回收站吗？','提示',true).then(function(){
						$http({
							method: 'POST',
							url: globals.basAppRoot + '/recycleBin/addItem',
							data: param
						}).then(function (response) {
							platformModalSvc.showSuccessTip(response.data.data);
							service.getDataList();
						});
					});
				}else{
					platformModalSvc.showWarmingMessage('请选择删除的项！','提示');
					return;
				}
			};


			service.sortItem = function sortItem(item1, item2) {
				var data = {};
				data.id1 = item1._id;
				data.id2 = item2._id;
				data.deptId = onlineServiceCatalogSvc.getSelectCatalog().id;
				service.sortItem(data);

			};

			//全选，反选
			service.checkAll = function checkAll(checked) {
				angular.forEach(serviceList.list, function (item) {
					if (checked) {
						item.isChecked = checked;
					} else {
						item.isChecked = !item.isChecked;
					}
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
				var data = {};
				data.id1 = item1._id;
				data.id2 = item2._id;
				service.sortItem(data);
			};


			//显示
			service.ifShow = function ifShow(item) {
				item.isDisplay = !item.isDisplay;
				service.save(item);
			};


			return service;
		}]);
}(angular));