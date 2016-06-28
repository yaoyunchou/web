/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('friendlyLinkEditCtrl', ['$scope', '$http', 'friendlyLinkSvc','platformModalSvc',function ($scope, $http, friendlyLinkSvc,platformModalSvc) {
		$scope.friendlyLink = angular.copy($scope.modalOptions.item);
		$scope.friendlyLinkSave = function friendlyLinkSave(){
			friendlyLinkSvc.friendlyLinkSave($scope.friendlyLink).then(function(data){
				if(data.isSuccess){
					platformModalSvc.showSuccessTip(data.data);
				}else{
					platformModalSvc.showWarmingTip(data.data);
				}
			});
			$scope.closeModal(true);
		};
		$scope.cancel = function cancel(){
			$scope.closeModal(true);
		};
	}]);
}(angular));
