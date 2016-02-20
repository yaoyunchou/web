/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('friendlyLinkEditCtrl', ['$scope', '$http', 'friendlyLinkSvc',  function ($scope, $http, friendlyLinkSvc) {
		$scope.friendlyLink = angular.copy($scope.modalOptions.item);
		$scope.friendlyLinkSave = function friendlyLinkSave(){
			friendlyLinkSvc.friendlyLinkSave($scope.friendlyLink);
			$scope.closeModal(true);
		};
		$scope.cancel = function cancel(){
			$scope.closeModal(true);
		};
	}]);
}(angular));
