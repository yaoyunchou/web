/**
 * Created by yaoyc on 2016/1/11.
 */
/*global angular*/
(function (angular) {
	"use strict";
	var systemSettingsApp = angular.module("systemSettingsApp");
	systemSettingsApp.controller('formTileCtrl', ['$scope', 'messageCatalogSvc', 'messageListConfigSvc', function ($scope, messageCatalogSvc, messageListConfigSvc) {
		$scope.editfieldBean = $scope.modalOptions.item;
		$scope.updata = function updata(){
			messageListConfigSvc.editFieldSvc($scope.editfieldBean);
			$scope.closeModal(true);
		}


	}]);
}(angular));