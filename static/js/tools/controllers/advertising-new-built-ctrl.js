/**
 * Created by yinc on 2016/1/16.
 */
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('advertisingNewBuiltCtrl', ['$scope', '$http','$state', 'advertisingSvc', function ($scope, $http,$state,advertisingSvc) {
		$scope.advList = {type:'imgs'};
		$scope.advType = true;
		$scope.img = {};
		$scope.state = {activeItemAdvanced:{},davImg:{}};
		$scope.switchJsType = function switchType(){
			$scope.advType = false;
			$scope.jsType = true;
		};

		$scope.switchImgType = function switchType(){
			$scope.advType = true;
			$scope.jsType = false;
		};

		advertisingSvc.getCtgAdvList(true).then(function(data){
			$scope.collectionAdvanced = data;
			//设置初始值
			$scope.state.activeItemAdvanced = data[0];
		});

		$scope.advInfoSave = function advInfoSave(advList){
			var imgs = [{'id':$scope.img.thumbnail[0]._id, 'url':$scope.img.thumbnail[0].url, 'alt':$scope.state.davImg.alt, 'adLink':$scope.state.davImg.adLink}];
			advList.ctgId = $scope.state.activeItemAdvanced._id;
			advList.imgs = imgs;
			advertisingSvc.advInfoSave(advList);
			$state.go('advertising');
		};

	}]);
}(angular));