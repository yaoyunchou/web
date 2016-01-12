/**
 * Created by yinc on 2016/1/7.
 */
(function (angular) {
	"use strict";

	angular.module('seoApp').factory('seoAloneSvc', ['$http','$q','platformModalSvc',
		function ($http,$q,platformModalSvc) {
			var service = {}, alonePage, aloneData;
			service.showSeoSpeedEdit = function showSeoSpeedEdit(item){
					platformModalSvc.showModal({
						templateUrl: globals.basAppRoute + 'seo/partials/seo-speed-edit.html',
						controller: 'seoSpeedEditCtrl',
						size: 'lg',
						options:{
							item:item
						}
					});



			};
			service.showAloneList = function showAloneList(){
				var defer = $q.defer();
				$http({
					method: 'GET',
					url: globals.basAppRoot + '/pageTpl/design/list/pageMainOrMain'
				}).then(function(res){
					if(res.data.isSuccess){
						alonePage = res.data.data||{};
						defer.resolve(alonePage);
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};
			service.editComfirm = function editComfirm(seoData){
				var defer = $q.defer();
				$http({
					method: 'PUT',
					url: globals.basAppRoot + '/pageTpl/design/pageMainOrMain/'+ seoData._id,
					data: seoData
				}).then(function(res){
					if(res.data.isSuccess){
						aloneData = res.data.data||{};
						defer.resolve(aloneData);
					}else{
						defer.reject(res.data.data);
					}
				});
				return defer.promise;
			};
			service.alonePreview = function alonePreview(id){
				window.open(globals.basAppRoot +"/pageTpl/design/"+id+"/view?isPubTpl=false");
			};
			return service;
		}]);
}(angular));