/**
 * Created by yinc on 2016/1/8.
 */
(function(angular){
	"use strict";
	angular.module('seoApp').factory('seoDefaultSvc',['$http','$q','platformModalSvc',function($http,$q,platformModalSvc){
		var service = {}, seoData;

		service.getSeoData = function getSeoData(){
			var defer = $q.defer();
			$http({
				method: 'GET',
				url: globals.basAppRoot + '/projConfig/DefaultSeo',
			}).then(function(res) {
				if(res.data.isSuccess){
					seoData = res.data.data?res.data.data.data:{};
					defer.resolve(seoData);
				}else{
					defer.reject(res.data.data.data);
				}
			});
			return defer.promise;
		};
		service.saveSeo = function saveSeo(){
			var defer = $q.defer();
			$http({
				method: 'POST',
				url: globals.basAppRoot + '/projConfig/DefaultSeoInstall',
				data: seoData

			}).then(function(res){
				if(res.data.isSuccess){
					var seoSuccesstip = res.data.data;
					defer.resolve(seoSuccesstip);
				}else{
					defer.reject(res.data.data);
				}
			});
			return defer.promise;
		};
		return service;
	}]);
}(angular));