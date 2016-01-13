/*globals nsw*/
(function (angular, nsw) {
	"use strict";


	angular.module('pageEditApp').controller('templateConfigPageDialogCtrl', ['$scope', 'templateEditDataSvc', 'platformModalSvc',
		function ($scope, dataService, platformModalSvc) {
			$scope.setting = $scope.modalOptions.setting;
			$scope.saveTpl = function () {
				dataService.savePageSetting().then(function () {
					$scope.closeModal(true);
				}, function (error) {
					platformModalSvc.showWarmingMessage(error, nsw.Constant.TIP);
				});
			};

			$scope.cancel = function () {
				$scope.closeModal(false);
			};
		}]);
}(angular, nsw));