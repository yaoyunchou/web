/**
 * Created by yinc on 2016/1/6.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoDefaultCtrl',['$scope','seoDefaultSvc','platformModalSvc', function($scope,seoDefaultSvc,platformModalSvc){
		$scope.seoDefault = seoDefaultSvc.seoData;
		seoDefaultSvc.getSeoData().then(function(data){
			$scope.seoDefault = data;
		});
		$scope.saveSeo = function saveSeo(){
			seoDefaultSvc.saveSeo().then(function(data){
				platformModalSvc.showSuccessTip(data,'提示');
			});
		};

	}]);
}(angular));