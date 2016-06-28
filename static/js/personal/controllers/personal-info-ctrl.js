/**
 * Created by yinc on 2016/1/11.
 */
(function (angular) {
	"use strict";

	angular.module('personalInfoApp').controller('personalInfoCtrl', ['$scope','personalInfoSvc','platformModalSvc', '$http', '$state', 'platformNavigationSvc',
		function($scope,personalInfoSvc,platformModalSvc){
			$scope.breadNavs = [{name:'首页',href:'#'}];

			/*点击个人信息修改，展开*/
			$scope.editState = true;
			$scope.personalInfoEdit = function personalInfoEdit(){
				if($scope.personalInfo.$dirty && !$scope.editState){
					platformModalSvc.showConfirmMessage('数据已经修改，确认返回？','提示').then(function(){
						$scope.editState = !$scope.editState;
					})
				}else {
					$scope.editState = !$scope.editState;
				}
			};

			/*点击密码修改，展开*/
			$scope.personalPwdEdit = function personalPwdEdit(){
				if($scope.passwordInfo.$dirty && $scope.password){
					platformModalSvc.showConfirmMessage('数据已经修改，确认返回？','提示').then(function(){
						$scope.password = false;
					})
				}else {
					$scope.password = !$scope.password;
				}
			};

			/*加载个人信息*/
			personalInfoSvc.getPersonalInfo().then(function(data){
				$scope.personnalInfo = data;
			});

			/*个人信息修改后保存*/
			$scope.personalInfoSave = function personalInfoSave(personnalInfo){
				$scope.editState = true;
				personalInfoSvc.personalInfoSave(personnalInfo).then(function(data){
					platformModalSvc.showSuccessTip(data,'提示');
				});
			};

			/*密码修改后保存*/
			$scope.passwordInfo = {};
			$scope.passWordSave = function passWordSave(passwordInfo){
				personalInfoSvc.passWordSave(passwordInfo).then(function(data){
					if(data.isSuccess){
						$scope.password = false;
					}else{
						$scope.password = true;
					}
					platformModalSvc.showSuccessTip(data.data,'提示');
				});
			};
		}]);
}(angular));