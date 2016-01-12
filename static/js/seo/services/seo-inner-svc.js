/**
 * Created by yinc on 2016/1/9.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').factory('seoInnerSvc',['$http','$q','platformModalSvc',function($http,$q){
		var service = {}, innerData;
		service.showInnerList = function showInnerList(){
			var defer = $q.defer();
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/module/extend/projModuleList',
			}).then(function(res) {
				if(res.data.isSuccess){
					innerData = res.data.data||{};
					defer.resolve(innerData);
				}else{
					defer.reject(res.data.data);
				}
			});
			return defer.promise;
		};
		return service;
	}]);
}(angular));