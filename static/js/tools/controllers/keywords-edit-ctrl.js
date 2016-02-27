/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('keyWordsEditCtrl', ['$scope', '$http', 'keywordsSvc', 'keywordsCatalogSvc','platformModalSvc', function ($scope, $http, keywordsSvc, keywordsCatalogSvc,platformModalSvc) {
		$scope.keywords = angular.copy($scope.modalOptions.item);
		$scope.editKeyWords = function editKeyWords(){			
			keywordsSvc.editKeyWords($scope.keywords).then(function(data){
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
