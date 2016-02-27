/*globals _*/
/**
 * Created by yinc on 2016/1/14.
 */
(function (angular) {
	"use strict";

	angular.module('toolApp').factory('advertisingSvc', ['$http','$q','platformModalSvc','platformMessenger',
		function ($http,$q,platformModalSvc,platformMessenger) {
			var service = {},selectedCatalog, advertisingList,advCategoryList;
			service.listLoaded = new platformMessenger();
			service.advFitlerOptions = {intIsDisplay:0,type:''};
			var buildSearchParam = function buildSearchParam(data){
				data = data || {};
				data.name = data.name||'';
				if(!_.isUndefined(selectedCatalog)){
					data.ctgId = selectedCatalog._id||'-1';
				}else{
					data.ctgId = '-1';
				}
				data.type = data.type||'';
				data.pageNum = data.pageNum||1;
				data.pageSize = data.pageSize||10;

				service.advFitlerOptions = data;
				var advFilter = service.advFitlerOptions || {};
				switch (advFilter.intIsDisplay){
					case 1:
						advFilter.isDisplay = false;
						break;
					case 2:
						advFilter.isDisplay = true;
						break;
					default :
						advFilter = _.omit(advFilter,'isDisplay');
				}
				advFilter = _.omit(advFilter,'intIsDisplay');
				return advFilter;
			};

			service.getAdvertisingData = function getAdvertisingData(data, cache){
				cache = angular.isUndefined(cache)?true:cache;
				data =!cache?data: buildSearchParam(data);
				return $http({
					method: 'PUT',
					url:globals.basAppRoot +'/advertisementList',
					data: data
				}).then(function(res){
					if(res.data.isSuccess){
						if(cache) {
							advertisingList = res.data.data || {imgs: [{}]};
							service.listLoaded.fire(advertisingList);
						}else{
							return  res.data.data || {imgs: [{}]};
						}
					}else{
						platformModalSvc.showErrorMessage(res.data);
					}
				});
			};

			service.getAdvertisingById = function getAdvertisingById(id){
				return $http({
					method: 'GET',
					url:globals.basAppRoot +'advertisement/'+id
				}).then(function(res){
					if (res.data.isSuccess) {
						return res.data.data||{};
					}else{
						platformModalSvc.showErrorMessage(res.data);
					}
				});
			};
			
			service.getItem = function getItem(id){
				advertisingList = advertisingList||[];
				return _.find(advertisingList.list,{_id:id});
			};

			service.createItem =function createItem(){
				var newItem = {
					ctgId:selectedCatalog._id,
					imgs:[],
					type :'imgs'
				};

				service.addImage(newItem);
				return newItem;
			};

			service.addImage = function addImage(adItem){
				adItem.imgs.push({adLink:'http://'});
			};

			service.advInfoSave = function advInfoSave(advList){
				var defer = $q.defer();
				$http({
					'method': 'POST',
					'url': globals.basAppRoot +'/advertisement',
					'data': advList,
				}).then(function(res){
					if(res.data.isSuccess){
						advertisingList = res.data.data||{};
						defer.resolve('保存成功');
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};

			/*右侧广告分类*/
			service.getCtgAdvList = function getCtgAdvList() {
				var defer = $q.defer();
				$http({
					'method': 'GET',
					'url': globals.basAppRoot +'/advertisementCtgList'
				}).then(function (response) {
					advCategoryList = response.data.data || [];
					defer.resolve(advCategoryList);
				}, function (response) {
					if (!response.data.isSuccess) {
						platformModalSvc.showWarmingTip(response.data.msg);
					}
				});
				return defer.promise;
			};

			service.getProctModuleId = function getProctModuleId() {
				var defer = $q.defer(),proctModuleId;
				$http({
					'method': 'GET',
					'url': globals.basAppRoot +'/module/extend/projPorductModuleId'
				}).then(function (response) {
					if(response.data.isSuccess){
						proctModuleId = response.data.data;
					}else{
						defer.reject(res.data.data);
					}
					defer.resolve(proctModuleId);
				});
				return defer.promise;
			};

			service.setSelectCatalog = function setSelectCatalog(data) {
				selectedCatalog = data;
				service.getAdvertisingData();
			};

			service.getSelectCatalog = function getSelectCatalog (data) {
				return selectedCatalog;
			};

			service.searchInfoAdv = function searchInfoAdv(adv){
				service.getAdvertisingData(adv);
			};

			service.advancedSearchAdv = function advancedSearchAdv(adv){
				service.getAdvertisingData(adv);
			};

			//分页查询。
			service.pageChanged = function pageChanged(data) {
				service.getAdvertisingData(data);
			};

			service.delAdv = function delAdv(ids){
				var defer = $q.defer();
				if(!ids){
					platformModalSvc.showWarmingMessage('请选择要放入回收站的条目！', '提示');
					return;
				}else{
					platformModalSvc.showConfirmMessage('确认放入回收站吗？','提示').then(function(){
						$http({
							method: 'POST',
							url: globals.basAppRoot + '/recycleBin/addItem',
							data: {'ids': ids, 'objName': 'Advertisement'}
						}).then(function(res){
							if(res.data.isSuccess){
								advertisingList = res.data.data||{};
								service.getAdvertisingData();
							}else{
								defer.resolve(advertisingList);
							}
						});
					});
				}
				return defer.promise;
			};
			service.save = function save(item){
				var defer = $q.defer();
				$http({
					method: 'PUT',
					url:globals.basAppRoot +'/advertisement/'+item._id,
					data: item
				}).then(function(res){
					if(res.data.isSuccess){
						defer.resolve(res.data.data);
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};
			return service;
		}]);
}(angular));
