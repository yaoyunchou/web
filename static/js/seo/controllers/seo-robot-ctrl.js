/**
 * Created by yinc on 2016/1/9.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').controller('seoRobotCtrl',['$scope','platformModalSvc','seoRobotSvc',function($scope,platformModalSvc,seoRobotSvc){
		seoRobotSvc.showRobot().then(function(data){
			$scope.robot = data;
		});
		$scope.saveRobot = function saveRobot(robot){
			seoRobotSvc.saveRobot(robot).then(function(data){
				platformModalSvc.showSuccessTip(data,'提示');
			});
		};
	}]);
}(angular));