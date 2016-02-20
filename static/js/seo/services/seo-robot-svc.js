/**
 * Created by yinc on 2016/1/9.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').factory('seoRobotSvc',['$http','$q','platformModalSvc',function($http,$q){
		var service = {}, robotData;
		service.showRobot = function showRobot(){
			var defer = $q.defer();
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/user/robot'
			}).then(function(res) {
				if(res.data.isSuccess){
					robotData = res.data.data||'';
					defer.resolve(robotData);
				}else{
					defer.reject(res.data.data);
				}
			});
			return defer.promise;
		};

		service.saveRobot = function saveRobot(robotText){
			var defer = $q.defer();
			$http({
				method: 'POST',
				url: globals.basAppRoot + '/user/addRobot',
				data: {'text':robotText}
			}).then(function(res) {
				if(res.data.isSuccess){
					robotData = res.data.data||{};
					defer.resolve(robotData);
				}else{
					defer.reject(res.data.data);
				}
			});
			return defer.promise;
		};
		service.robotHelp = function robotHelp(){
			window.open('http://baike.baidu.com/link?url=z4dPqacLp7a8JCGKd9WyKDLZf92aau2hkufv_Yn3dQvCvMbT8HLgMS10skDd6mb_1UU23LKsr_xHvXEferJGha');
		};
		service.robotPreview = function robotPreview(){
			var downLoadWnd = window.open('down','_blank');
			downLoadWnd.document.write('<script>window.open(\''+globals.basAppRoot + 'user/downRobot\')</script>');
			downLoadWnd.document.title = "down Robot";
		};
		return service;
	}]);
}(angular));