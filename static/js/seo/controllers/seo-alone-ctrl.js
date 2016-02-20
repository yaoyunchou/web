/**
 * Created by yinc on 2016/1/7.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoAloneCtrl',['$scope','$http','platformModalSvc','seoAloneSvc',
		function($scope,$http,platformModalSvc,seoAloneSvc){
			seoAloneSvc.showAloneList().then(function(data){
				$scope.aloneList = data;
			});
			$scope.seoSpeedEdit = function seoSpeedEdit(item){
				seoAloneSvc.showSeoSpeedEdit(item);
			};
			$scope.alonePreview = function alonePreview(id){
				seoAloneSvc.alonePreview(id);
			};
			$scope.searchInfoArticle = function searchInfoArticle(){
				var name = $scope.name;
				seoAloneSvc.searchInfoArticle(name).then(function(data){
					$scope.aloneList = data;
				});
			};
	}]);
}(angular));