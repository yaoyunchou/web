(function (angular) {
	"use strict";


	angular.module('product').factory('productClassifyDataSvc',['baseService','$http','$q',function(baseService,$http,$q){
		var service, loadedItems, selectedItems,ctgTreeData;
		service = baseService.createDataService({
			http:{'CURD':'/pccms/productCtg','C':'/pccms/productCtg/create','D':'/pccms/productCtg'},
			presentation:{
				selectMode:'multi',//'single'
			}
		});

		service.getCtgTree = function getCtgTree(){
			var defer = $q.defer();
			if(ctgTreeData){
				defer.resolve(ctgTreeData);
			}else {
				$http.get('/pccms/productCtg/tree/all').then(function(response){
					if (response.isSuccess) {
						ctgTreeData = response.data;
						defer.resolve(ctgTreeData);
					}
				});
			}
			return defer.promise;
		};


		return service;
		/*
		service.save = function save(){};
		service.create = function create(){};
		service.deleteItem = function deleteItem(){};
		service.getList = function getList(){};
		service.getItem =function getItem(){};

		service.showSpeedEdit = function(){};

		service.selectItem = function selectItem(item){};

		service.getSelectedItem = function getSelectedItem(){};
		return service;*/
	}]);
}(angular));