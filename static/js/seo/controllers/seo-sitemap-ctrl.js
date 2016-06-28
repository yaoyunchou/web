(function (angular) {
	"use strict";
	angular.module('seoApp').controller('siteMapCtrl', ['$state','siteMapCatalogSvc', 'siteMapListSvc', '$scope',
		function ($state,siteMapCatalogSvc, siteMapListSvc, $scope) {
			//$scope.rightNavTitle = "网站地图频道管理";
			//初始化
			siteMapCatalogSvc.init().then(function(data){
				if(data){
					siteMapCatalogSvc.getCtgDetpList(true).then(function (data) {
						$scope.dataList = data;
						if ($scope.catalogListOptions.setData) {
							$scope.catalogListOptions.setData(data);
						}
					});
				}else{
					//$state.go('err')
				}

			});
			//sitemap cagalog
			$scope.FatherAdd = function FatherAdd() {
				siteMapCatalogSvc.addDept($scope.FatherBean).then(function () {
					$scope.FatherBean = {};
				});
			};

			/*$scope.deletDept = function deletDept(item, index) {
				var massage = '确认要删除' + item.name + '网站地图频道吗?删除后当前频道里面的链接将全部删除,建议先将链接转移频道.'
				platformModalSvc.showConfirmMessage(massage, '网站操作信息提示').then(function () {
					siteMapCatalogSvc.deletCatalog(item.id);
				});
			};*/
			var navListLoaded = function navListLoaded(data) {

				if ($scope.catalogListOptions.setData) {
					$scope.dataList = data;
					$scope.catalogListOptions.setData(data);
				}else{
					$scope.catalogListOptions.datalist = data;
				}
			};
			$scope.gotoPage = function gotoPage(item) {
				siteMapCatalogSvc.setSelectCatalog(item);
			};
			$scope.isCatalogSelected = function isCatalogSelected(item) {
				return item.id === siteMapCatalogSvc.getSelectCatalog().id;
			};
			$scope.switchSortIndex = function switchSortIndex(item1, item2) {
				siteMapCatalogSvc.switchSortIndex(item1, item2);

			};
			$scope.whiteFun = function whiteFun(item) {
				if (!item.whiteSpace) {
					item.whiteSpace = true;
				} else {
					siteMapCatalogSvc.updataDept(item).then(function () {
						//onlineService.getTabDataList();
					});
					item.whiteSpace = false;

				}
			};
			siteMapCatalogSvc.registerNavListLoaded(navListLoaded);
			$scope.$on('$destroy', function () {
				siteMapCatalogSvc.unregisterNavListLoaded(navListLoaded);
				siteMapListSvc.unregisterListLoaded(onListLoaded);
			});


			//sitemap list
			siteMapListSvc.getTabDataList();
			var onListLoaded = function onListLoaded(data) {
				$scope.tabDataList = data;
			};
			$scope.addLink = function addLink() {
				var bean = {
					'name': $scope.link.name,
					'url': $scope.link.url,
					'type': {
						'id': siteMapCatalogSvc.getSelectCatalog().id,
						'name': siteMapCatalogSvc.getSelectCatalog().name
					}
				};
				siteMapListSvc.addLink(bean);
				$scope.link = {};
				$scope.formOnlineServiceName.$setPristine(true);
			};
			$scope.$watch('queryName', function (newOptions, oldOptions) {
				siteMapListSvc.setSeach(newOptions);
			}, true);
			$scope.catalogListOptions = {
				caption: '网站地图频道管理',
				onSelectedChanged: siteMapCatalogSvc.setSelectCatalog,
				onSorted: siteMapCatalogSvc.switchSortIndex,
				onDeleted: siteMapCatalogSvc.deletCatalog,
				onCreated: siteMapCatalogSvc.addDept,
				onSpeedEdit:siteMapCatalogSvc.updataDeptModel,
				data: {
					dataList: $scope.dataList,
					displayField: 'name',
					selectedItem: siteMapCatalogSvc.getSelectCatalog()
				}, formOptions: {
					name: 'catalogConfig',
					//是否显示label
					hasLabel: false,
					//beyong 对应的提示
					hasValidateTip: false,
					//初始化
					data: {},
					rows: [{
						label: '链接名称',
						domain: 'name',
						size: 12,
						maxLength: 18,
						placeholder:'请填写频道名称',
						model: 'name'
					},{
						label: '链接URL',
						domain: 'text',
						placeholder:'请填写频道对应网址',
						maxLength: 100,
						size: 12,
						required: true,
						model: 'url'/*,
						validates:[{
							directive:'ng-pattern="/^http://([\w-]+\.)+[\w-]+(/[\w- ./?%&=]*)?/"',
							type:'pattern',
							message:'以http://开头,如http://www.nsw88.com'
						}]*/
					}]
				}
			};
			$scope.interchange = function interchange(item1, item2) {
				siteMapListSvc.interchange(item1, item2);
			};
			//編輯在線客服
			$scope.editOnlineSvcModal = function editOnlineSvcModal(item) {
				siteMapListSvc.editOnlineSvcModal(item, $scope.dataList);
			};
			$scope.ifShow = function ifShow(item) {
				siteMapListSvc.ifShow(item);
			};
			//删除当个在线客服
			$scope.deletSingleOnlineSvc = function deletSingleOnlineSvc(item) {
				siteMapListSvc.deletSingleOnlineSvc(item);
			};
			$scope.checkAll = function checkAll() {
				siteMapListSvc.checkAll();
			};
			$scope.inverse = function inverse() {
				siteMapListSvc.inverse();
			};
			$scope.radioTop = function radioTop(e) {
				siteMapListSvc.radioTop(!e);
			};
			$scope.batchDelete = function batchDelete() {
				siteMapListSvc.batchDelete();
			};
			$scope.searchLink = function searchLink() {
				siteMapListSvc.searchLink($scope.queryName).then(function (data) {
					$scope.tabDataList = data;
				})
			};

			siteMapListSvc.registerListLoaded(onListLoaded);

		}]);
}(angular));