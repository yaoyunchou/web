/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module("systemSettingsApp");
	systemSettingsApp.controller('formDesignerCtrl', ['$scope', 'messageCatalogSvc', 'messageListConfigSvc', function ($scope, messageCatalogSvc, messageListConfigSvc) {
		$scope.tabDataList = $scope.modalOptions.item;
		var listsLoaded = function listsLoaded(data){
			$scope.tabDataList = data;
		};

		messageListConfigSvc.registerListsLoaded(listsLoaded);
		//单个删除
		$scope.deletSingleFieldSvc = function deletSingleFieldSvc(item){
			messageListConfigSvc.deletSingleFieldSvc(item)
		};
		//批量删除
		$scope.batchDelete = function batchDelete(){
			messageListConfigSvc.batchDelete();
		};
		//全选
		$scope.checkAll = function checkAll() {
			messageListConfigSvc.checkAll();
		};
		$scope.inverse = function inverse() {
			messageListConfigSvc.inverse();
		};
		$scope.radioTop = function radioTop(e) {
			messageListConfigSvc.radioTop(!e);
		};

		//排序
		$scope.interchange = function interchange(item1,item2){
			var data ={id1:item1._id,id2:item2._id};
			messageListConfigSvc.sortItem(data);

		};

		$scope.isRequired = function isRequired(item){
			item.isRequired = !item.isRequired;
			messageListConfigSvc.editFieldSvc(item);
		};
		$scope.titleSpeedEdit = function titleSpeedEdit(item){
				messageListConfigSvc.addFieldModal(item);
		};

		//新增文本
		$scope.addFieldModal = function addFieldModal(){
			messageListConfigSvc.addFieldModal(null);
		};
		$scope.$on('$destory',function(){
			messageListConfigSvc.unregisterListsLoaded(listsLoaded);
		});
	}]);
}(angular));