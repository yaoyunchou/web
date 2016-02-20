/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module("systemSettingsApp");
	systemSettingsApp.controller('catalogConfigCtrl', ['$scope', 'messageCatalogSvc', 'messageListConfigSvc', function ($scope, messageCatalogSvc, messageListConfigSvc) {
		messageCatalogSvc.getCtgDetpList(true).then(function (data) {
			$scope.dataList = data;
		});
		var navListLoaded = function navListLoaded(data) {
			$scope.dataList = data;
			if ($scope.catalogListOptions.setData) {
				$scope.catalogListOptions.setData(data);
			}
		};

		$scope.catalogListOptions = {
			caption: '意向订单分类',
			onSelectedChanged: messageCatalogSvc.setSelectCatalog,
			/*onSorted: messageCatalogSvc.switchSortIndex,*/
			onDeleted: messageCatalogSvc.deletCatalog,
			onCreated: messageCatalogSvc.addDept,
			onLineEdited:messageCatalogSvc.updataDept,
			data: {
				dataList: $scope.dataList,
				displayField: 'name',
				selectedItem: messageCatalogSvc.getSelectCatalog()
			}, formOptions: {
				name: 'catalogConfig',
				//是否显示label
				hasLabel: false,
				//beyong 对应的提示
				hasValidateTip: false,
				//初始化
				data: {},
				rows: [{
					label: '留言分类',
					domain: 'name',
					placeholder:'请填写意向订单分类名称',
					size: 12,
					maxLength: 18,
					model: 'name'

				}]
			}
		};
		//获取配置信息
		var onListLoaded = function onListLoaded(data) {
			$scope.bean = data;
			if($scope.bean.timeInterval){
				$scope.limit=true;
			}else{
				$scope.limit = false;
			}
		};
		messageCatalogSvc.registerNavListLoaded(navListLoaded);
		messageListConfigSvc.registerListLoaded(onListLoaded);
		$scope.$on('$destroy', function () {
			messageListConfigSvc.unregisterListLoaded(onListLoaded);
			messageCatalogSvc.unregisterNavListLoaded(navListLoaded);
		});

		//form
		$scope.desigenerForm = function desigenerForm(item){
			messageListConfigSvc.desigenerForm(item);

		};
		//更新配置
		$scope.updata = function updata(){
			messageCatalogSvc.changeConfig($scope.bean);
		};
		$scope.getJS = function getJS(){
			messageListConfigSvc.getJSModal($scope.bean);
		}

	}]).controller('getJSCtrl',['$scope','messageListConfigSvc',function($scope, messageListConfigSvc){
		$scope.bean = $scope.modalOptions.data;

	}]);
}(angular));