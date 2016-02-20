/**
 * Created by yinc on 2016/1/26.
 */
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');
	toolApp.controller('advLibCtrl', ['$scope', '$http', 'advertisingSvc',

		function ($scope, $http, advertisingSvc) {
			var url = document.location.href;
			var moduleIdIndex = url.indexOf("moduleId");
			var urlLength = url.length;
			var moduleId = url.substr(moduleIdIndex + 9, urlLength).split("&")[0];
			$scope.options = {};
			$scope.totalItems = 0; //总条数
			$scope.pageSize = 4; //每页显示多少条
			var currentPageCache = {};
			$scope.options.currentPage = 1;
			$scope.maxSize = 5; //设置分页条的长度。
			var selectedCatalog;

			var loadData = function loadData() {
				$scope.options.currentPage = $scope.options.currentPage || 1;
				currentPageCache[$scope.selectedCatalog._id] = $scope.options.currentPage;
				var filter = {
					ctgId: $scope.selectedCatalog._id,
					pageNum: $scope.options.currentPage,
					pageSize: $scope.pageSize
				};
				advertisingSvc.getAdvertisingData(filter, false).then(function (data) {
					data = data || {};
					$scope.totalItems = (data.list || []).length;
					$scope.advList = data.list;
					$scope.totalItems = data.totalItems;
				});
			};

			advertisingSvc.getProctModuleId().then(function(data){
				$scope.productModuleId = data;
			});

			advertisingSvc.getCtgAdvList().then(function (data) {
				$scope.selectedCatalog = _.find(data, {_id: moduleId}) || _.find(data, {_id: $scope.productModuleId});
				if(data._id === "MAINPAGE"){
					$scope.selectedCatalog = _.find(data, {_id: "MAINPAGE"});
				};
				if(data._id === "OTHERS"){
					$scope.selectedCatalog = _.find(data, {_id: "OTHERS"});
				};
				$scope.itmesbig = [];
				for (var i = 0; i < data.length; i++) {
					if (i % 5 === 0) {
						var tem = [];
						for (var j = 0; j < 5; j++) {
							if (i + j < data.length) {
								tem.push(data[i + j]);
							}
						}
						$scope.itmesbig[parseInt(i / 5)] = tem;
					}
				}
				$scope.selectCatalog($scope.selectedCatalog);
				loadData();
			});


			if ($scope.modalOptions.selected) {
				advertisingSvc.getAdvertisingById($scope.modalOptions.selected).then(function (ad) {
					$scope.selectedAd = $scope.modalOptions.name;
				});
			}

			//选择标签类型
			$scope.selectCatalog = function (item) {
				$scope.selectedCatalog = item;
				$scope.options.currentPage = currentPageCache[$scope.selectedCatalog._id];
				loadData();
			};

			$scope.getCatalogClass = function getCatalogClass(item) {
				if (item === $scope.selectedCatalog) {
					return 'c-selected';
				}
			};

			$scope.isCatalogSelected = function isCatalogSelected(item) {
				return item === $scope.selectedCatalog;
			};

			$scope.selectAd = function selectAd(ad) {
				$scope.closeModal(true, ad);
			};

			$scope.pageChanged = function (item) {
				loadData();
			};

		}]);
}(angular));