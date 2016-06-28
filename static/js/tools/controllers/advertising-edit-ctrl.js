/*globals _*/
/**
 * Created by yinc on 2016/1/16.
 */
(function (angular) {
	"use strict";
	var toolApp = angular.module('toolApp');

	toolApp.controller('advertisingEditCtrl',
		['$scope', '$http', '$state', '$stateParams', 'advertisingSvc', 'platformModalSvc', 'desktopMainSvc',
			function ($scope, $http, $state, $stateParams, advertisingSvc, platformModalSvc, desktopMainSvc) {
				if ($stateParams.id) {
					$scope.advList = advertisingSvc.getItem($stateParams.id);
					if (!$scope.advList) {
						$state.go('advertising');
						return;
					}
				} else {
					$scope.advList = advertisingSvc.createItem();
					$scope.isNew = true;
				}
				$scope.showPcImage = $scope.showPhoneImage  =false;


				//设置初始值
				advertisingSvc.getCtgAdvList(true).then(function (data) {
					$scope.collectionAdvanced = data;
				});

				//保存
				$scope.advInfoSave = function advInfoSave() {
					if ($scope.isNew) {
						advertisingSvc.advInfoSave($scope.advList).then(function(message){
							platformModalSvc.showSuccessTip(message);
							$state.go('advertising');
						},function(error){
							platformModalSvc.showWarmingTip(error);
						})
					} else {
						advertisingSvc.save($scope.advList).then(function(message){
							platformModalSvc.showSuccessTip(message);
							$state.go('advertising');
						},function(error){
							platformModalSvc.showWarmingTip(error);
						});
					}

				};

				//添加图片广告
				$scope.addImage = function addImage(adItem) {
					if (adItem.imgs.length > 4) {
						platformModalSvc.showWarmingMessage('最多只能添加5张图片！', '提示');
						return;
					}
					advertisingSvc.addImage(adItem);
				};

				//图片广告上下排序
				$scope.sortImage = function sortImage(index1, index2) {
					var imgIndex1 = $scope.advList.imgs[index1];
					$scope.advList.imgs[index1] = $scope.advList.imgs[index2];
					$scope.advList.imgs[index2] = imgIndex1;
					forms = [];
				};

				var forms = {};
				$scope.isValid = true;
				$scope.isDirty = false;
				$scope.setForm = function setForm(name, form) {
					forms[name] = forms[name] || form;
					$scope.isValid = !_.find(forms, {$invalid: true});
					$scope.isDirty = !!_.find(forms, {$dirty: true});
					return true;
				};

				//删除图片
				$scope.removeImage = function removeImage(index) {
					$scope.advList.imgs.splice(index, 1);
					forms[index] = null;
				};

				//重置
				$scope.advReset = function advReset() {
					$scope.advList = advertisingSvc.createItem();
					_.forEach(forms,function(form){
						if(form){
							forms['100'].$setPristine();
						}
					});
					forms =[];
					$scope.isNew = true;
				};

				//图片广告、js广告选择切换
				$scope.switchType = function switchType(type){
					if(type === 'js'){
						_.forEach(forms,function(form,key){
							if(key!=='100'){
								forms[key] = null;
							}
						});
					}
				};
				desktopMainSvc.getProjectType().then(function(){
					var isPhone = desktopMainSvc.isPoneProject();
					var isPc = desktopMainSvc.isPcProject();
					var isResponsive = desktopMainSvc.isResponsiveProject();

					$scope.showPcImage = isPc || isResponsive;
					$scope.showPhoneImage = isPhone || isResponsive;
				});

			}]);
}(angular));