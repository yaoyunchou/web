/**
 * Created by yinc on 2016/1/11.
 */
(function (angular) {
	"use strict";

	angular.module('personalInfoApp').factory('personalInfoSvc', ['$http', '$q', 'platformNavigationSvc', 'platformMessenger',
		function ($http,$q) {
			var service = {}, personnalInfo;
			service.inited = false;

			/*加载个人信息*/
			service.getPersonalInfo = function getPersonalInfo(){
				var defer = $q.defer();
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/user/userInfo'
				}).then(function(res){
					if(res.data.isSuccess){
						personnalInfo = res.data.data;
						defer.resolve(personnalInfo);
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};

			/*个人信息修改保存*/
			service.personalInfoSave = function personalInfoSave(personnalInfo){
				var defer = $q.defer();
				$http({
					method: 'PUT',
					url: globals.basAppRoot + '/user/userInfo',
					data: personnalInfo
				}).then(function(res){
					if(res.data.isSuccess){
						var personnalInfoEditTip = res.data.data;
						defer.resolve(personnalInfoEditTip);
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};

			/*密码修改保存*/
			service.passWordSave = function passWordSave(passwordInfo){
				var defer = $q.defer();
				$http({
					method: 'PUT',
					url: globals.basAppRoot + '/user/changePwd',
					data: passwordInfo
				}).then(function(res){
					var passwordEditTip;
					if(res.data.isSuccess){
						passwordEditTip = res.data;
						defer.resolve(passwordEditTip);
					}else{
						passwordEditTip = res.data;
						defer.resolve(passwordEditTip);
						//defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};
			return service;
		}]);
}(angular));