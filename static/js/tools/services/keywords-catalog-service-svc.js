/**
 * Created by yaoyc on 2016/1/6.
 */
/*global angular, _*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.factory('keywordsCatalogSvc', ['$q', '$http', 'platformModalSvc', 'platformMessenger', function ($q, $http, platformModalSvc, PlatformMessenger) {
		var service = {},selected,serviceList;
		service.listLoaded = new PlatformMessenger();
		service.selectedChanged = new PlatformMessenger();

		//获取list 数据
		service.getDataList = function getDataList() {	
			$http.get('/pccms/keyword/keywordsCtg').then(function (response) {
				serviceList = response.data.data||[];
				if(selected) {
					selected = _.find(serviceList, {_id: selected._id})
				}
				service.listLoaded.fire(serviceList);
			}, function (response) {
				platformModalSvc.showWarmingTip(response.data.data);
			});
		};
		
		service.setSelectCatalog = function setSelectCatalog(catalog){
			selected = catalog;
			service.selectedChanged.fire(catalog);
		};
		
		service.getSelected = function getSelected(){
			return selected;
		};
				
		service.getDataList();		
		return service;
	}]);
}(angular));