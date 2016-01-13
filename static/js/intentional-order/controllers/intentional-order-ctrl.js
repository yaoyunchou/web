/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function(angular){
	"use strict";
	var intentionalOrderApp = angular.module("intentionalOrderApp");
	intentionalOrderApp.controller('intentionalOrderCtrl',['$scope',function($scope){
		$scope.catalogListOptions = {
			caption: '部门管理',
			/*onSorted: onlineServiceCatalog.switchSortIndex,
			onDeleted: onlineServiceCatalog.deletCatalog,
			onSelectedChanged: onlineServiceCatalog.setSelectCatalog,
			onCreated: onlineServiceCatalog.addDept,
			onLineEdited: onlineServiceCatalog.addDept,*/
			data: {
				dataList: $scope.dataList,
				sortBy: 'orderBy',
				displayField: 'name',
				/*selectedItem: onlineServiceCatalog.getSelectCatalog()*/
			},
			formOptions: {
				formName: 'onLineCatalog',
				hasLabel: false,
				hasValidateTip: false,
				data: {},
				rows: [{
					label: '部门名称',
					domain: 'name',
					size: 12,
					required: false,
					model: 'name'
				}]
			}
		};
	}]);
}(angular));