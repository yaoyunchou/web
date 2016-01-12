/**
 * Created by yinc on 2016/1/7.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoSpeedEditCtrl',['$scope','platformModalSvc','seoAloneSvc',function($scope,platformModalSvc,seoAloneSvc){
		$scope.alonePage = $scope.modalOptions.item;
		$scope.editComfirm = function editComfirm(seoData){
			seoAloneSvc.editComfirm(seoData).then(function(data){
				$scope.aloneList = data;
				$scope.closeModal(true);
				platformModalSvc.showSuccessTip(data,'提示');
			});
		};
	}]);
}(angular));