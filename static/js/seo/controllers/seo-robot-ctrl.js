/**
 * Created by yinc on 2016/1/9.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoRobotCtrl',['$scope','platformModalSvc','seoRobotSvc',function($scope,platformModalSvc,seoRobotSvc){
		seoRobotSvc.showRobot().then(function(data){
			$scope.robot = data;
			if($scope.robot){
				$scope.isShowPreview = true;
			}else{
				$scope.isShowPreview = false;
			}
		});
		$scope.saveRobot = function saveRobot(robot){
			seoRobotSvc.saveRobot(robot).then(function(data){
				if($scope.robot){
					$scope.isShowPreview = true;
				}else{
					$scope.isShowPreview = false;
				}
				platformModalSvc.showSuccessTip(data);
			});
		};
		$scope.robotHelp = function robotHelp(){
			seoRobotSvc.robotHelp();
		};

		$scope.robotPreview = function robotPreview(){
			seoRobotSvc.robotPreview();
		};
	}]);
}(angular));