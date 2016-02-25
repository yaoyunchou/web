/*globals nsw*/
(function (angular) {
	"use strict";

	angular.module('pageEditApp').controller('templateBlkSelectDialogCtrl', ['$scope','$state','platformModalSvc','templateEditDataSvc',
		function ($scope,$state,platformModalSvc,dataService) {
			dataService.getBlkType().then(function(data){
					$scope.blkDataList = data;
			});
			$scope.blkSelected = function blkSelected(item){
				var blkType = [];
				$scope.selected = item;
				if(item){
					blkType.push(item);
				}

				if($scope.modalOptions.fromSwitch) {
					platformModalSvc.showConfirmMessage('该模板类型会替换之前的数据，确定替换吗？', '提示').then(function(){
						$scope.closeModal(true, item.blkType);
					},function(){
						$scope.closeModal(false);
					});
				}else{
					$scope.closeModal(true, item.blkType);
				}
			};
		}]);
}(angular));