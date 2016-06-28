/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function(angular){
	"use strict";
	var intentionalOrderApp = angular.module("intentionalOrderApp");
	intentionalOrderApp.controller('messageReplyCtrl',['$scope','messageListSvc',function($scope,messageListSvc){
		$scope.editBean = $scope.modalOptions.item;
		$scope.ok = function ok(){
			messageListSvc.editOrdereSvc($scope.editBean);
			$scope.closeModal(true);
		}
	}]);
}(angular));