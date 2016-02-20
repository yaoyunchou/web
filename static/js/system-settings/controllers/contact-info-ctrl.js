/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('systemSettingsApp');

	toolApp.controller('contactInfoCtrl', ['$scope', '$http', 'contactInfoSvc', function ($scope, $http, contactInfoSvc) {
		
		
		$scope.contactInfoSave = function contactInfoSave() {			
			contactInfoSvc.saveCreate();
		};

		//編輯在線客服
		$scope.editOnlineSvcModal = function editOnlineSvcModal(item) {
			contactInfoSvc.editOnlineSvcModal(item, $scope.dataList);
		};
		//删除当个在线客服
		$scope.remove = function remove(item) {
			contactInfoSvc.remove(item);
		};
		
		$scope.checkAll = function checkAll(value) {	
			$scope.isCheckAll = value; 	
			contactInfoSvc.checkAll(value);
		};
	
	
		$scope.batchDelete = function batchDelete() {
			contactInfoSvc.batchDelete();
		};
		
	
		var onListLoaded = function onListLoaded(data) {			
			$scope.contactInfo = data;			
		};
		$scope.interchange = function interchange(item1, item2) {
			contactInfoSvc.interchange(item1, item2);
		};

		
		
		$scope.ifShow = function ifShow(item) {
			contactInfoSvc.ifShow(item);
		};
		
		$scope.search = function search(filter){
			contactInfoSvc.getDataList(filter);
		};
		
		contactInfoSvc.getDataList();
		contactInfoSvc.listLoaded.register(onListLoaded);
		$scope.$on('$destroy', function () {
			contactInfoSvc.listLoaded.unregister(onListLoaded);
		});			
		


	}])
		.controller('keywordsEditCtrl', ['$scope', 'friendlyLinkSvc', function ($scope, friendlyLinkSvc) {
			$scope.editBean = $scope.modalOptions.item;
			$scope.ctgList = $scope.modalOptions.dataList;
			$scope.defultName = $scope.ctgList[0];
			console.log($scope.ctgList);
			$scope.ok = function ok() {
				contactInfoSvc.editOnlineSvc($scope.editBean);
				$scope.closeModal(true);
			};
		}]);
}(angular));
