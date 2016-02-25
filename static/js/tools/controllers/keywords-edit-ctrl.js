/*global angular*/
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('keyWordsEditCtrl', ['$scope', '$http', 'keywordsSvc', 'keywordsCatalogSvc', function ($scope, $http, keywordsSvc, keywordsCatalogSvc) {
		$scope.keywords = angular.copy($scope.modalOptions.item);
		$scope.editKeyWords = function editKeyWords(){			
			keywordsSvc.editKeyWords($scope.keywords);			
			$scope.closeModal(true);
		};
		$scope.cancel = function cancel(){
			$scope.closeModal(true);
		};
	}]);
}(angular));
