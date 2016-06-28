/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.factory('keywordsSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger', 'keywordsCatalogSvc',
		function ($q, $http, platformModalSvc, PlatformMessenger, keywordsCatalogSvc) {
			var service = {}, serviceList, selectedCatalog;
			service.listLoaded = new PlatformMessenger(),
				//获取list 数据
				service.getDataList = function getDataList(filter) {
					if (!selectedCatalog) {
						return;
					}
					filter = filter || {};
					filter.moduleId = selectedCatalog.moduleId;
					$http({
						url: '/pccms/keyword/listKeyWords',
						method: 'GET',
						params: filter
					}).then(function (response) {
							serviceList = response.data.data || {};
							service.listLoaded.fire(serviceList);
						}, function (response) {
							platformModalSvc.showWarmingTip(response.data.data);
						});
				};


			//添加
			service.saveCreate = function saveCreate(data) {
				return $http({
					'method': 'POST',
					'url': '/pccms/keyword',
					'data': data
				}).then(function (response) {
					if(response.data.isSuccess) {
						service.getDataList();
						keywordsCatalogSvc.getDataList();
					}
					return response.data;
				}, function (response) {
					platformModalSvc.showWarmingTip(response.data.data);
				});
			};

			service.save = function save(data) {
				$http({
					'method': 'PUT',
					'url': '/pccms/keyword/updStatus/' + data._id,
					'data': data
				}).then(function (response) {
					service.getDataList();
				});
			};

			//编辑关键词信息
			service.editKeyWords = function editKeyWords(item) {
				var defer = $q.defer(), keyWordsData;
				var keywordsList, data = {'name': item.name, 'url': item.url};
				$http({
					'method': 'PUT',
					'url': '/pccms/keyword/edit/' + item._id,
					'data': data
				}).then(function (res) {				
					if(res.data.isSuccess){
						keyWordsData = service.getDataList();
					}else{
						keyWordsData = res.data;
					}
					defer.resolve(res.data);
				});
				return defer.promise;
			};

			//删除
			service.remove = function remove(data) {
				var ids = [];
				if (_.isObject(data)) {
					ids.push(data._id);
				} else {
					ids = _.map(_.filter(serviceList.list, {isChecked: true}), '_id');
				}
				var param = {ids: ids.join(','), objName: 'Keywords'};
				if(ids.length>0){
					platformModalSvc.showConfirmMessage('确定删除到回收站吗？','提示',true).then(function(){
						$http({
							method: 'POST',
							url: globals.basAppRoot + '/recycleBin/addItem',
							data: param
						}).then(function (response) {
							platformModalSvc.showSuccessTip(response.data.data);
							service.getDataList();
							keywordsCatalogSvc.getDataList();
						});
					});
				}else{
					platformModalSvc.showWarmingMessage('请选择删除的项！','提示');
					return;
				}
			};

			//编辑
			service.showEditModal = function showEditModal(item, dataList) {
				platformModalSvc.showModal({
					backdrop: 'static',
					templateUrl: globals.basAppRoot + 'js/tools/partials/online-service-edit.html',
					controller: 'editOnlineSvcCtrl',
					size: 'lg',
					userTemplate: true,
					options: {
						item: item,
						dataList: dataList
					}
				});
			};

			service.sortItem = function sortItem(item1, item2) {
				var data = {};
				data.id1 = item1._id;
				data.id2 = item2._id;
				data.deptId = onlineServiceCatalogSvc.getSelectCatalog().id;
				service.sortItem(data);
			};

			//全选
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
					url: '/pccms/keyword/sort',
					params: data
				}).then(function () {
					service.getDataList();
				});
			};

			service.interchange = function movUp(item1, item2) {
				var selectedCatalog = keywordsCatalogSvc.getSelected();
				var data = {};
				data.id1 = item1._id;
				data.id2 = item2._id;
				data.ctgId = selectedCatalog.moduleId;
				service.sortItem(data);
			};


			//显示删除
			service.ifShow = function ifShow(item) {
				item.isDisplay = !item.isDisplay;
				service.save(item);
			};


			var selectedCatalogChanged = function selectedCatalogChanged(selected) {
				selectedCatalog = selected;
				service.getDataList();
			};
			keywordsCatalogSvc.selectedChanged.register(selectedCatalogChanged);

			return service;
		}]);
}(angular));